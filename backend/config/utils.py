from lxml import etree as ET
import os
import re
from decimal import Decimal
from datetime import datetime

from django.db.models import Q
from django.db import IntegrityError, DataError, transaction
from django.contrib.auth.hashers import make_password
from django.utils.timezone import make_aware
from faker import Faker

from User.models import CustomUser
from auctions.models import Item



FAKE_PASSWORD_HASH = make_password("import-password")

def is_email(value):
    return re.match(r"[^@]+@[^@]+\.[^@]+", value) is not None

def parse_price(price_str):
    if price_str is None:
        return None
    return Decimal(price_str.replace('$', '').replace(',', '').strip())


def create_random_user(identifier):
    try:
        if is_email(identifier):
            username = identifier.split("@")[0]
            email = identifier
        else:
            username = identifier
            email = identifier + "@email.com"

        user = CustomUser(
            username=username,
            email=email,
            first_name="first_name",
            last_name="last_name",
            country="Greece",
            region="Attica",
            city="Athens",
            postal_code="1",
            address="odos dit",
            house_number="100",
            phone="+306969696969",
            AFM=11112222,
            password=FAKE_PASSWORD_HASH,  # Directly assign hashed password
        )
        return user
    except Exception as e:
        print(f"Error creating random user ({identifier}): {e}")
        return None

def load_users_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    for user_el in root.findall('User'):
        try:
            user = CustomUser.objects.create_user(
                username=user_el.findtext('Username'),
                password=user_el.findtext('Password'),
                email=user_el.findtext('Email'),
                first_name=user_el.findtext('FirstName'),
                last_name=user_el.findtext('LastName'),
                country=user_el.findtext('Country'),
                region=user_el.findtext('Region'),
                city=user_el.findtext('City'),
                postal_code=user_el.findtext('PostalCode'),
                address=user_el.findtext('Address'),
                house_number=int(user_el.findtext('HouseNumber') or 0),
                phone=user_el.findtext('Phone'),
                AFM=int(user_el.findtext('AFM') or 0),
            )
            print(f"Created user: {user.username}")
        except Exception as e:
            print(f"Failed to create user: {e}")

def load_items_from_xml(path):
    print("Loading Items...")

    for file in os.listdir(path):

        if not file.endswith('.xml'):
            continue

        print(f"\nProcessing file: {file}")

        tree = ET.parse(os.path.join(path, file))
        root = tree.getroot()

        # Collect seller IDs from all items in the file
        seller_ids = set()
        for item_el in root.findall('Item'):
            seller_tag = item_el.find('Seller')
            if seller_tag is not None:
                seller_id = seller_tag.attrib.get('UserID')
                if seller_id:
                    seller_ids.add(seller_id)

        # Query existing users from DB (by username or email)
        existing_users_qs = CustomUser.objects.filter(Q(username__in=seller_ids) | Q(email__in=seller_ids))
        user_cache = {u.username: u for u in existing_users_qs}
        user_cache.update({u.email: u for u in existing_users_qs})

        items_to_create = []
        users_to_create = []

        processed_count = 0
        skipped_count = 0
        error_count = 0

        for item_el in root.findall('Item'):
            try:
                # Extract fields
                item_id = item_el.get('ItemID')
                name = item_el.findtext('Name')
                categories = [c.text for c in item_el.findall('Category')]
                currently = parse_price(item_el.findtext('Currently'))
                buy_price = parse_price(item_el.findtext('Buy_Price'))
                first_bid = parse_price(item_el.findtext('First_Bid'))
                location = item_el.findtext('Location')
                country = item_el.findtext('Country')
                description = item_el.findtext('Description')

                # Parse dates
                dt_format = "%b-%d-%y %H:%M:%S"
                started_dt = make_aware(datetime.strptime(item_el.findtext('Started'), dt_format))
                ends_dt = make_aware(datetime.strptime(item_el.findtext('Ends'), dt_format))

                # Handle seller
                seller_tag = item_el.find('Seller')
                seller_id = seller_tag.attrib.get('UserID') if seller_tag is not None else None

                seller = user_cache.get(seller_id)
                if not seller:
                    # Create new user instance but don't save yet
                    seller = create_random_user(seller_id)
                    if seller:
                        users_to_create.append(seller)
                        user_cache[seller_id] = seller
                    else:
                        skipped_count += 1
                        continue

                # Create Item object with seller foreign key as CustomUser instance
                item = Item(
                    item_id=item_id,
                    name=name,
                    currently=currently,
                    buy_price=buy_price,
                    first_bid=first_bid,
                    number_of_bids=0,
                    location=location,
                    country=country,
                    started=started_dt,
                    ends=ends_dt,
                    seller=seller,
                    description=description,
                )
                items_to_create.append(item)
                processed_count += 1

            except Exception as e:
                error_count += 1
                print(f"Error loading item {item_el.get('ItemID')}: {e}")

        # Bulk create new users and items inside a transaction
        try:
            with transaction.atomic():
                if users_to_create:
                    CustomUser.objects.bulk_create(users_to_create, batch_size=100)
                if items_to_create:
                    Item.objects.bulk_create(items_to_create, batch_size=100)
            print(f"Saved {len(users_to_create)} users and {len(items_to_create)} items from {file}")
        except Exception as e:
            print(f"Error during bulk save for {file}: {e}")

        print(f"Processed {processed_count} items, skipped {skipped_count}, errors {error_count}")