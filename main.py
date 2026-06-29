import json
import os

SCORES_FILE = "data/scores.json"

# AMIRUL'S PART
def get_leaderboard():
    scores = load_scores()

    scores.sort(key=lambda x: x["score"], reverse=True)

    return scores


def show_leaderboard():
    scores = get_leaderboard()

    print("\n===== TypeRush Leaderboard =====")

    if len(scores) == 0:
        print("No scores yet.")
    else:
        rank = 1

        for player in scores:
            print(str(rank) + ". " + player["username"] + " - " + str(player["score"]))
            rank += 1
