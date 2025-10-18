import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv
from src.types.environment import AWSCredentials

class EnvironmentService:
  def __init__(self):
    load_dotenv(find_dotenv())

  def get(self, key: str) -> Optional[str]:
    """
    Retrieves an environment variable by key.
    Returns None if the variable is not set.
    
    Raises:
      KeyError: if the variable is not set.
    """
    value = os.getenv(key)
    if value is None:
        raise KeyError(f"Missing environment variable: {key}")
    return value
  
  
  def get_aws_env(self) -> AWSCredentials:
    """
    Retrieves the AWS credentials for the different AWS Services from the `.env` file.
    
    Raises:
      KeyError: if any of the AWS credentials are missing from the `.env` file.
    """
    
    aws_bucket = self.get("AWS_BUCKET")
    aws_access_key = self.get("AWS_ACCESS_KEY")
    aws_secret_key = self.get("AWS_SECRET_KEY")
    aws_region = self.get("AWS_REGION")
    return AWSCredentials(
      aws_bucket=aws_bucket,
      aws_access_key=aws_access_key,
      aws_secret_key=aws_secret_key,
      aws_region=aws_region,
    )
    
  def get_openai_api_key(self) -> str:
    """
    Retrieves the OpenAI API key from the `.env` file.
    
    Raises:
      KeyError: if the API key is missing from the `.env` file.
    """
    return self.get("OPENAI_API_KEY")
    
environment_service = EnvironmentService()