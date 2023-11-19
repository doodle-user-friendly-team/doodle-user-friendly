from rest_framework.exceptions import PermissionDenied
from rest_framework import status


class MissingDataException(PermissionDenied):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Some data is missing"
    default_code = 'invalid'

    def __init__(self, detail, status_code=None):
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code