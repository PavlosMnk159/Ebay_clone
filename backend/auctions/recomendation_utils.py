import numpy as np

from rest_framework.response import Response
from rest_framework import status

from .models import Item
from .serializers import ItemSerializer

    
def matrix_factorization(R, K=10, steps=200, alpha=0.01, beta=0.01):
    """
    Perform matrix factorization using SGD.
    """
    num_users, num_items = R.shape
    P = np.random.rand(num_users, K)
    Q = np.random.rand(num_items, K)
    Q = Q.T

    for step in range(steps):
        for i in range(num_users):
            for j in range(num_items):
                if R[i][j] > 0:
                    eij = R[i][j] - np.dot(P[i, :], Q[:, j])
                    for k in range(K):
                        P[i][k] += alpha * (eij * Q[k][j] - beta * P[i][k])
                        Q[k][j] += alpha * (eij * P[i][k] - beta * Q[k][j])

    return np.dot(P, Q)



def recommend_items(request, InteractionModel, available_items):
    user = request.user

    # Collect bids
    interactions = list(InteractionModel.objects.all().values("bidder_id", "item_id", "amount"))
    if not interactions:
        return Response([], status=status.HTTP_200_OK)

    # Map users & items to indices
    users = list({b["bidder_id"] for b in interactions})
    items = list({b["item_id"] for b in interactions})
    user_to_index = {u: i for i, u in enumerate(users)}
    item_to_index = {it: j for j, it in enumerate(items)}

    # Build user-item matrix
    R = np.zeros((len(users), len(items)))
    for b in interactions:
        R[user_to_index[b["bidder_id"]], item_to_index[b["item_id"]]] = float(1)

    # Factorize
    R_hat = matrix_factorization(R, K=10, steps=100)

    # Get predictions for this user
    if user.id not in user_to_index:
        return Response([], status=status.HTTP_200_OK)

    u_idx = user_to_index[user.id]
    scores = R_hat[u_idx]

    # Exclude already bid items
    already_bid = {b["item_id"] for b in interactions if b["bidder_id"] == user.id}

    available_ids = set(available_items.values_list("id", flat=True))
    candidate_items = [
        (item_id, scores[item_to_index[item_id]])
        for item_id in available_ids
        if item_id in item_to_index and item_id not in already_bid
    ]

    # Sort by predicted score
    candidate_items.sort(key=lambda x: x[1], reverse=True)

    # Fetch the items
    recommended_item_ids = [item_id for item_id, _ in candidate_items]
    recommended_items = Item.objects.filter(id__in=recommended_item_ids)

    # Serialize & return
    serializer = ItemSerializer(recommended_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)