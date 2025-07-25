import xml.etree.ElementTree as ET
from User.models import CustomUser
from django.db import IntegrityError

def load_users_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    for user_el in root.findall('User'):
        username = user_el.findtext('Username')
        password = user_el.findtext('Password')
        email = user_el.findtext('Email')
        first_name = user_el.findtext('FirstName')
        last_name = user_el.findtext('LastName')
        country = user_el.findtext('Country')
        region = user_el.findtext('Region')
        city = user_el.findtext('City')
        postal_code = user_el.findtext('PostalCode')
        address = user_el.findtext('Address')
        house_number = int(user_el.findtext('HouseNumber') or 0)
        phone = user_el.findtext('Phone')
        afm = int(user_el.findtext('AFM') or 0)

        try:
            user = CustomUser.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name,
                country=country,
                region=region,
                city=city,
                postal_code=postal_code,
                address=address,
                house_number=house_number,
                phone=phone,
                AFM=afm,
            )
            print(f"Created user: {username}")

        except Exception as e:
            print(f"Failed to create user '{username}': {e}")
