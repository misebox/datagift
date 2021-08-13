from datagift.exceptions import DataGiftException
import boto3
from botocore.client import Config
from . import config
import re
import base64


def s3safe_encode(raw_str):
    # Slash is used as seperator to express structure
    return b'/'.join(
        # trim trailing b'='
        base64.urlsafe_b64encode(part).rstrip(b'=')
        for part in raw_str.encode('utf-8').split(b'/')
    ).decode()

def s3safe_decode(safe_str):
    # safe_str is like: '44GCeHg' or 'YWJj/MTAw/44GCeHg'
    return b'/'.join(
        base64.urlsafe_b64decode(
            b64_part + (
                # complete trailing b'=' to decode base64
                b'=' * -(len(b64_part) % -4)
            )
        )
        for b64_part in safe_str.encode().split(b'/')
    ).decode('utf-8')

def generate_url_for_uploading(params):
    username = params['username']
    filename = params['body']['filename']
    size = params['body']['size']
    if size > 1024 * 1024 * 10:
        raise DataGiftException(f'The item size is too large {size}')

    # Convert filename to safe string, instead to raise error
    safe_filename = s3safe_encode(filename)

    key = f'{username}/uploaded/{safe_filename}'
    s3 = boto3.client(
        's3',
        config=Config(signature_version='s3v4'),
        region_name='ap-northeast-1')
    url = s3.generate_presigned_url(
        ClientMethod='put_object', 
        Params=dict(
            Bucket=config.BUCKET,
            Key=key,
        ),
        ExpiresIn=600,
        HttpMethod='PUT')
    return dict(url=url)


def delete_object(params):
    username = params['username']
    filename = params['body']['filename']
    # Convert filename to safe string, instead to raise error
    safe_filename = s3safe_encode(filename)
    key = f'{username}/uploaded/{safe_filename}'
    s3 = boto3.client('s3', region_name='ap-northeast-1')
    result = s3.delete_object(
        Bucket=config.BUCKET,
        Key=key
    )
    print(result)
    return {}


def list_uploaded_objects(params):
    username = params['username']
    prefix = f'{username}/uploaded/'
    s3 = boto3.client('s3', region_name='ap-northeast-1')
    continuation_token = None
    contents = []
    while True:
        if continuation_token:
            res = s3.list_objects_v2(
                Bucket=config.BUCKET,
                Prefix=prefix,
                MaxKeys=10,
                ContinuationToken=continuation_token)
        else:
            res = s3.list_objects_v2(
                Bucket=config.BUCKET,
                Prefix=prefix,
                MaxKeys=10)
        contents.extend(res['Contents'])
        if res['IsTruncated']:
            continuation_token = res['NextContinuationToken']
            continue
        # reached the end of result
        break
    items = []
    for content in contents:
        encoded = content['Key'].split('/', 2)[2]
        try:
            filename = s3safe_decode(encoded)
        except Exception:
            filename = encoded
        item = dict(
            etag=content['ETag'],
            filename=filename,
            lastModified=content['LastModified'].isoformat(),
            size=content['Size'],
        )
        items.append(item)
    total_size = sum(obj['Size'] for obj in contents)
    return dict(
        items=items,
        count=len(contents),
        totalSize=total_size,
    )