from leaderboard import save_score, show_leaderboard





#  AMIRUL'S PART
# Ask the player to enter their username
# The username will be saved together with the score
username = input("Enter your username: ")


# Display a message to show that the game is starting
print("\nStarting TypeRush...")

# Display a message to show that the game has ended
print("Game ended!")


# Ask the player to enter their score manually
# Later, this line will be replaced by the actual score from game.py
score = int(input("Enter your score: "))


# Save the username and score into data/scores.json
# This comes from the save_score function inside leaderboard.py
save_score(username, score)

# Display a message to confirm that the score has been saved
print("\nYour score has been saved.")

show_leaderboard()
