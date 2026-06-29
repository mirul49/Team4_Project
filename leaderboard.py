# leaderboard.py

import json
import os

# Location of the scores file
SCORES_FILE = "data/scores.json"


# This function creates the data folder and scores.json file if missing
def create_scores_file():

    if not os.path.exists("data"):
        os.makedirs("data")

    if not os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, "w") as file:
            json.dump([], file)


# This function loads scores from scores.json
def load_scores():

    create_scores_file()

    with open(SCORES_FILE, "r") as file:
        scores = json.load(file)

    return scores


# This function saves a new score into scores.json
def save_score(username, score):

    scores = load_scores()

    new_score = {
        "username": username,
        "score": score
    }

    scores.append(new_score)

    scores.sort(key=lambda x: x["score"], reverse=True)

    with open(SCORES_FILE, "w") as file:
        json.dump(scores, file, indent=4)


# This function gets the leaderboard from highest score to lowest score
def get_leaderboard():

    scores = load_scores()

    scores.sort(key=lambda x: x["score"], reverse=True)

    return scores


# This function displays the leaderboard
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
