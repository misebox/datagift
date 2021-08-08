# syntax = docker/dockerfile:1.2

FROM public.ecr.aws/lambda/python:3.8
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
COPY app.py ./
CMD ["app.handler"]
