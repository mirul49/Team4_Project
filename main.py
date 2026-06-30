import sys
# Import the auth module
import auth

# Import functions from settings.py
from settings import show_difficulty_options, choose_difficulty, get_settings

# Import functions from leaderboard.py
from leaderboard import save_score, show_leaderboard

# Import functions from game.py
from game import start_game

print("="*45)
print("          WELCOME TO TYPERUSH          ")
print("="*45)

while True:
    print("\n1. Login")
    print("2. Register")
    print("3. Exit")
    auth_choice = input("Choose an option: ").strip()

    if auth_choice == "1":
        uname = input("Enter username: ")
        pwd = input("Enter password: ")
        success, message = auth.login(uname, pwd)
        print(f" {'✓' if success else '✗'} {message}")
        if success:
            break  # Break out of the auth loop to start the game

    elif auth_choice == "2":
        uname = input("Choose a username: ")
        pwd = input("Choose a password: ")
        success, message = auth.register(uname, pwd)
        print(f" {'✓' if success else '✗'} {message}")
        if success:
            print("Please log in with your new account.")

    elif auth_choice == "3":
        print("Goodbye!")
        sys.exit()
    else:
        print("Invalid option. Please choose 1, 2, or 3.")

# Retrieve the verified username from the active session
username = auth.get_current_user()


# Show difficulty menu
show_difficulty_options()


# Ask player to choose difficulty
choice = input("Choose difficulty 1, 2, or 3: ")


# Convert the choice into Easy, Medium, or Hard
difficulty = choose_difficulty(choice)


# Get the settings for the selected difficulty
game_settings = get_settings(difficulty)


# Show selected game settings
print("\n===== Selected Settings =====")
print("Difficulty:", game_settings["difficulty"])
print("Time Limit:", game_settings["time_limit"], "seconds")
print("Word Speed:", game_settings["word_speed"])
print("Word List:", game_settings["word_list"])


# Start game message
print("\nStarting TypeRush...")


# Start the TypeRush game
score = start_game(game_settings)


# Save username and score into data/scores.json
save_score(username, score)


# Confirm score is saved
print("\nYour score has been saved!")


# Show leaderboard after saving score
show_leaderboard()
