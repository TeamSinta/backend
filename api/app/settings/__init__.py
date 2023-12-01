import os

from .base import *

environment = os.environ.get("ENVIRONMENT")

print(f"You are running environment: {environment}")

if environment == "prod":
    from .prod import *
elif environment == "staging":
    from .staging import *
else:
    from .dev import *
