# Import functions from settings.py
from settings import show_difficulty_options, choose_difficulty, get_settings

# Import functions from leaderboard.py
from leaderboard import save_score, show_leaderboard


# Ask player for username
username = input("Enter your username: ")


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


# Temporary score input for testing
# Later, Cheng Rou can replace this with the real score from game.py
score = int(input("Enter your score: "))


# Save username and score into data/scores.json
save_score(username, score)


# Confirm score is saved
print("\nYour score has been saved!")


# Show leaderboard after saving score
show_leaderboard()
