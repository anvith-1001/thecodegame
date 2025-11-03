def check_answer(challenge, selected_answer: str) -> bool:
    return challenge["correct_answer"].strip().lower() == selected_answer.strip().lower()


def calculate_xp(is_correct: bool, difficulty: str) -> int:
    if not is_correct:
        return 0
    if difficulty == "easy":
        return 10
    elif difficulty == "medium":
        return 20
    elif difficulty == "hard":
        return 30
    return 0
