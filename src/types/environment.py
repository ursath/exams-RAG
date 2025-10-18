from typing import TypedDict

class AWSCredentials(TypedDict):
  aws_bucket: str
  aws_access_key: str
  aws_secret_key: str
  aws_region: str
