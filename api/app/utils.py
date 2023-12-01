import time


def seconds_to_minutes(seconds):
    return time.strftime("%M:%S", time.gmtime(seconds))
