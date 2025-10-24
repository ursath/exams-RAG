from typing import List
from src.types.environment import AWSCredentials
from src.services.environment_service import environment_service
import boto3

class S3Service:
  def __init__(self, aws_env: AWSCredentials):
    """
    Initialize an S3 Client with some basic methods.
    """
    self._client = boto3.client(
      "s3",
      # aws_access_key_id=aws_env["aws_access_key"],
      # aws_secret_access_key=aws_env["aws_secret_key"],
      region_name=aws_env["aws_region"],
    )
    self._bucket = aws_env["aws_bucket"]
    
  def upload_file(self, key: str, text: str) -> None:
    """
    Upload text content to S3 given a specific `key`.
    
    For example, `s3_client.upload_file("my/awesome/docs/test.txt", "this is awesome!")`.
    """
    self._client.put_object(Bucket=self._bucket, Key=key, Body=text.encode("utf-8"))

  def retrieve_file(self, key: str) -> str:
    """
    Retrieve text content from S3 given a specific `key`.
    
    For example, `s3_client.retrieve_file("my/awesome/docs/test.txt")`.
    """
    response = self._client.get_object(Bucket=self._bucket, Key=key)
    return response["Body"].read().decode("utf-8")

  def list_objects(self, prefix: str = "") -> List[str]:
    """
    List object keys under a given prefix.
    
    For example, `s3_client.list_objects("my/awesome"")`.
    """
    response = self._client.list_objects_v2(Bucket=self._bucket, Prefix=prefix)
    contents = response.get("Contents", [])
    return [obj["Key"] for obj in contents]

  def delete_file(self, key: str) -> None:
    """
    Delete a file from S3 given a specific `key`.
    
    For example, `s3_client.delete_file("my/awesome/docs/test.txt")`.
    """
    self._client.delete_object(Bucket=self._bucket, Key=key)

s3_service = S3Service(aws_env=environment_service.get_aws_env())