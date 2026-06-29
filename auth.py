"""
auth.py - Login/Register Module
Member 2 - Peng Yong

Handles:
  - Registering a new user
  - Logging in an existing user
  - Logging out the current user
  - Tracking the currently logged-in user (session)

Data is stored in data/users.json
"""

import json
import os
import hashlib

# ── Path to the users data file ──────────────────────────────────────────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "users.json")

# ── In-memory session (who is currently logged in) ───────────────────────────
_current_user = None   # Will hold the username string when logged in


# ═════════════════════════════════════════════════════════════════════════════
#  INTERNAL HELPERS
# ═════════════════════════════════════════════════════════════════════════════

def _load_users() -> dict:
    """Load the users.json file and return its contents as a dict."""
    if not os.path.exists(DATA_FILE):
        # Create the file with an empty users list if it doesn't exist yet
        _save_users({"users": []})
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def _save_users(data: dict) -> None:
    """Save the given dict back to users.json."""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


def _hash_password(password: str) -> str:
    """Return a SHA-256 hash of the password (never store plain text)."""
    return hashlib.sha256(password.encode()).hexdigest()


def _find_user(username: str) -> dict | None:
    """Return the user dict if found, else None."""
    data = _load_users()
    for user in data["users"]:
        if user["username"].lower() == username.lower():
            return user
    return None


# ═════════════════════════════════════════════════════════════════════════════
#  PUBLIC API  (called by main.py or other modules)
# ═════════════════════════════════════════════════════════════════════════════

def register(username: str, password: str) -> tuple[bool, str]:
    """
    Register a new user.

    Returns:
        (True,  "Registration successful!")  on success
        (False, <reason>)                    on failure
    """
    username = username.strip()

    # ── Validation ────────────────────────────────────────────────────────
    if not username:
        return False, "Username cannot be empty."
    if len(username) < 3:
        return False, "Username must be at least 3 characters."
    if len(username) > 20:
        return False, "Username must be 20 characters or fewer."
    if not username.isalnum():
        return False, "Username can only contain letters and numbers."
    if not password:
        return False, "Password cannot be empty."
    if len(password) < 4:
        return False, "Password must be at least 4 characters."

    # ── Check for duplicates ──────────────────────────────────────────────
    if _find_user(username):
        return False, f"Username '{username}' is already taken."

    # ── Save new user ─────────────────────────────────────────────────────
    data = _load_users()
    data["users"].append({
        "username": username,
        "password": _hash_password(password),
        "high_score": 0          # default field used by Amirul's leaderboard
    })
    _save_users(data)

    return True, "Registration successful!"


def login(username: str, password: str) -> tuple[bool, str]:
    """
    Log in an existing user.

    Returns:
        (True,  "Login successful! Welcome, <username>")  on success
        (False, <reason>)                                 on failure
    """
    global _current_user

    username = username.strip()

    if not username or not password:
        return False, "Please enter both a username and a password."

    user = _find_user(username)

    if user is None:
        return False, "Username not found. Please register first."

    if user["password"] != _hash_password(password):
        return False, "Incorrect password. Please try again."

    _current_user = user["username"]   # preserve original capitalisation
    return True, f"Login successful! Welcome, {_current_user}!"


def logout() -> tuple[bool, str]:
    """
    Log out the current user.

    Returns:
        (True,  "Goodbye, <username>!")  if someone was logged in
        (False, "No user is logged in.") otherwise
    """
    global _current_user

    if _current_user is None:
        return False, "No user is currently logged in."

    name = _current_user
    _current_user = None
    return True, f"Goodbye, {name}! See you next time."


def get_current_user() -> str | None:
    """Return the username of the logged-in user, or None."""
    return _current_user


def is_logged_in() -> bool:
    """Return True if someone is currently logged in."""
    return _current_user is not None


def update_high_score(username: str, new_score: int) -> None:
    """
    Update the high score for a user if new_score beats their current record.
    Called by Cheng Rou's game module after each game.
    """
    data = _load_users()
    for user in data["users"]:
        if user["username"].lower() == username.lower():
            if new_score > user.get("high_score", 0):
                user["high_score"] = new_score
            break
    _save_users(data)


def get_all_users() -> list[dict]:
    """
    Return a list of all users (without passwords).
    Used by Amirul's leaderboard module.
    """
    data = _load_users()
    return [
        {"username": u["username"], "high_score": u.get("high_score", 0)}
        for u in data["users"]
    ]


# ═════════════════════════════════════════════════════════════════════════════
#  STANDALONE TEST  (run `python auth.py` to try it out)
# ═════════════════════════════════════════════════════════════════════════════

def _auth_menu():
    """Simple text-based menu to manually test the auth module."""
    print("\n" + "="*45)
    print("   AUTH MODULE TEST  (Member 2 - Peng Yong)")
    print("="*45)

    while True:
        print(f"\nLogged in as: {get_current_user() or 'Nobody'}")
        print("1. Register")
        print("2. Login")
        print("3. Logout")
        print("4. Show all users (leaderboard data)")
        print("5. Exit")

        choice = input("Choose an option: ").strip()

        if choice == "1":
            uname = input("  New username: ")
            pwd   = input("  New password: ")
            ok, msg = register(uname, pwd)
            print(f"  {'✓' if ok else '✗'} {msg}")

        elif choice == "2":
            uname = input("  Username: ")
            pwd   = input("  Password: ")
            ok, msg = login(uname, pwd)
            print(f"  {'✓' if ok else '✗'} {msg}")

        elif choice == "3":
            ok, msg = logout()
            print(f"  {'✓' if ok else '✗'} {msg}")

        elif choice == "4":
            users = get_all_users()
            if users:
                print(f"\n  {'Username':<20} High Score")
                print(f"  {'-'*30}")
                for u in users:
                    print(f"  {u['username']:<20} {u['high_score']}")
            else:
                print("  No users registered yet.")

        elif choice == "5":
            print("  Exiting auth test. Bye!")
            break
        else:
            print("  Invalid option, try again.")


if __name__ == "__main__":
    _auth_menu()

