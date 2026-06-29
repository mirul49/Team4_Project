import json
import os

SCORES_FILE = "data/scores.json"


def create_scores_file():
    if not os.path.exists("data"):
        os.makedirs("data")

    if not os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, "w") as file:
            json.dump([], file)


def load_scores():
    create_scores_file()

    with open(SCORES_FILE, "r") as file:
        scores = json.load(file)

    return scores


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


def get_leaderboard():
    scores = load_scores()

    scores.sort(key=lambda x: x["score"], reverse=True)

    return scores


def show_leaderboard():
    scores = get_leaderboard()

    print("===== Leaderboard =====")

    if len(scores) == 0:
        print("No scores yet.")
    else:
        rank = 1

        for player in scores:
            print(str(rank) + ". " + player["username"] + " - " + str(player["score"]))
            rank += 1
