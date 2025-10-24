# Use the official AWS Lambda Python 3.12 image
FROM public.ecr.aws/docker/library/python:3.12.1-slim
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# Set working directory
WORKDIR /var/task

COPY src/ ./src
COPY requirements.txt ./
RUN python -m pip install -r requirements.txt

# Lambda entry point
CMD ["gunicorn", "-b=:8080", "-w=1", "src.app:app"]