class DataGiftException(Exception):
    def __init__(self, reason: str):
        self.reason = reason
