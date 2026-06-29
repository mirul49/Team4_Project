# game.py

import random
import time
from auth import is_logged_in, get_current_user

def start_game(game_settings):

    # Check if the player is logged in
    if not is_logged_in():
        print("Please login before playing TypeRush.")
        return 0

    username = get_current_user()

    # Get game settings
    time_limit = game_settings["time_limit"]
    word_list = game_settings["word_list"]
    difficulty = game_settings["difficulty"]

    score = 0

    print("\n===== TypeRush =====")
    print("Player:", username)
    print("Difficulty:", difficulty)
    print("Time Limit:", time_limit, "seconds")
    print("Type the words exactly as shown.")
    print("Press Enter after each word.")

    input("\nPress Enter to start...")

    start_time = time.time()

    while True:

        # Calculate remaining time
        current_time = time.time()
        time_left = time_limit - (current_time - start_time)

        # End game when time is up
        if time_left <= 0:
            break

        # Select a random word
        word = random.choice(word_list)

        print("\n------------------------")
        print("Time Left:", int(time_left), "seconds")
        print("Current Score:", score)
        print("Word:", word)

        typed_word = input("Type here: ")

        if typed_word == word:
            score += 1
            print("Correct!")
        else:
            print("Wrong!")

    print("\n===== Game Over =====")
    print("Final Score:", score)

    return score
