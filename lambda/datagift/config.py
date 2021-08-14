import os


ENV_MODE = os.environ['ENV_MODE']
BUCKET = os.environ['BUCKET']
REGION = os.environ['REGION']
ALLOWED_ORIGINS = set(os.environ['ALLOWED_ORIGINS'].split(','))