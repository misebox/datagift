import boto3
from botocore.client import Config
from . import config
import re


def generate_url_for_uploading(params):
    username = params['username']
    filename = params['body']['filename']
    if re.search(r'[^a-zA-Z0-9_+-.]', filename):
        raise Exception('Invalid filename')

    key = f'{username}/uploaded/{filename}'
    s3 = boto3.client(
        's3',
        config=Config(signature_version='s3v4'),
        region_name='ap-northeast-1')
    url = s3.generate_presigned_url(
        ClientMethod='put_object', 
        Params={'Bucket': config.BUCKET, 'Key': key},
        ExpiresIn=600,
        HttpMethod='PUT')
    return dict(url=url)

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
        item = dict(
            etag=content['ETag'],
            filename=content['Key'].split('/', 2)[2],
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