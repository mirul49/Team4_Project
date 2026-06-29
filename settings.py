# settings.py

def get_settings(difficulty):
    if difficulty == "Easy":
        return {
            "difficulty": "Easy",
            "time_limit": 60,
            "word_speed": 1,
            "word_list": [
                "cat", "dog", "sun", "book", "tree",
                "fish", "ball", "apple", "chair", "school"
            ]
        }

    elif difficulty == "Medium":
        return {
            "difficulty": "Medium",
            "time_limit": 45,
            "word_speed": 2,
            "word_list": [
                "python", "keyboard", "monitor", "student", "window",
                "typing", "orange", "project", "science", "computer"
            ]
        }

    elif difficulty == "Hard":
        return {
            "difficulty": "Hard",
            "time_limit": 30,
            "word_speed": 3,
            "word_list": [
                "development", "leaderboard", "challenge", "application",
                "programming", "difficulty", "technology", "performance",
                "communication", "responsibility"
            ]
        }

    else:
        return {
            "difficulty": "Easy",
            "time_limit": 60,
            "word_speed": 1,
            "word_list": [
                "cat", "dog", "sun", "book", "tree",
                "fish", "ball", "apple", "chair", "school"
            ]
        }


def show_difficulty_options():
    print("===== Difficulty Settings =====")
    print("1. Easy - 60 seconds, simple words")
    print("2. Medium - 45 seconds, normal words")
    print("3. Hard - 30 seconds, harder words")


def choose_difficulty(choice):
    if choice == "1":
        return "Easy"
    elif choice == "2":
        return "Medium"
    elif choice == "3":
        return "Hard"
    else:
        return "Easy"
