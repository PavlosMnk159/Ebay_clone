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

    # Collect interactions (bids or visits)
    interactions = list(InteractionModel.objects.all().values("bidder_id", "item_id", "amount"))

    # Map users & items to indices for matrix factorization
    users = list({b["bidder_id"] for b in interactions})
    items_in_interactions = list({b["item_id"] for b in interactions})
    user_to_index = {u: i for i, u in enumerate(users)}
    item_to_index = {it: j for j, it in enumerate(items_in_interactions)}

    # Build user-item matrix only for items that exist in interactions
    R = np.zeros((len(users), len(items_in_interactions)))
    for b in interactions:
        R[user_to_index[b["bidder_id"]], item_to_index[b["item_id"]]] = float(1)

    # Factorize
    if len(users) > 0 and len(items_in_interactions) > 0:
        R_hat = matrix_factorization(R, K=10, steps=100)
    else:
        R_hat = np.zeros((len(users), len(items_in_interactions)))

    # Scores for current user
    scores = {}
    if user.id in user_to_index:
        u_idx = user_to_index[user.id]
        # Assign scores for items in interaction matrix
        for item_id, j in item_to_index.items():
            scores[item_id] = R_hat[u_idx, j]

    # Assign default score 0 for all available items not in interactions
    for item in available_items:
        if item.item_id not in scores:
            scores[item.item_id] = 0

    # Sort descending
    candidate_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    # Keep only items that are in available_items
    available_ids = set([item.item_id for item in available_items])
    recommended_item_ids = [item_id for item_id, _ in candidate_items if item_id in available_ids]

    # Fetch the items
    recommended_items = [item for item in available_items if item.item_id in recommended_item_ids]

    # Serialize & return
    serializer = ItemSerializer(recommended_items, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)