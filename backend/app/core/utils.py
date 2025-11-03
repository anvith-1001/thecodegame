import random
import string

def generate_guest_name():
    return "Guest_" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
