from datagift.store import list_uploaded_objects
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
        downloadCount=0,
        since=now,
        plan='free',
        maxItemCount=16,
        maxItemSize=10 * 1024 * 1024,
        capacity=10 * 1024 * 1024,
        capacityUsed=0,
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
            list_result = list_uploaded_objects(dict(username=params['username']))
            total_size = 0
            for item in list_result['items']:
                total_size += item['size']
            user_info['capacityUsed'] = total_size
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
    return dict(userInfo=user_info)
