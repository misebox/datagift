import json
import datetime

import boto3
import botocore
from botocore.client import Config

from . import config
from .exceptions import DataGiftException

def create_user_info(params):
    now = datetime.datetime.utcnow().isoformat()
    obj = dict(
        sub=params['sub'],
        username=params['username'],
        download_count=0,
        since=now,
        plan='free',
        max_item_count=16,
        max_item_size=100 * 1024 * 1024,
    )
    return obj

def get_self_information(params):
    username = params['username']
    key = f'{username}/user_info.json'

    session = boto3.session.Session(region_name='ap-northeast-1')
    s3 = session.client('s3')
    try:
        obj = s3.get_object(
            Bucket=config.BUCKET,
            Key=key,
        )
        try:
            user_info = json.loads(obj['Body'].read().decode('utf-8'))
        except json.JSONDecodeError as ex:
            raise DataGiftException(ex.msg)
    except s3.exceptions.NoSuchKey:
        user_info = create_user_info(params)
        try:
            res = s3.put_object(
                Bucket=config.BUCKET,
                Key=key,
                Body=json.dumps(user_info),
            )
        except botocore.exceptions.ClientError:
            raise DataGiftException('Failed to put initial user info')
    return user_info
