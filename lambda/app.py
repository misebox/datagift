import json

from datagift import config
from datagift import store
from datagift import user
from datagift.exceptions import DataGiftException


router = {
    'user/self': user.get_self_information,
    'store/uploading_url': store.generate_url_for_uploading,
    'store/downloading_url': store.generate_url_for_downloading,
    'store/list_items': store.list_uploaded_objects,
    'store/delete_item': store.delete_object,
}
def handler(event, context):
    ctx = {
        "get_remaining_time_in_millis": context.get_remaining_time_in_millis(),
        "function_name": context.function_name,
        "function_version": context.function_version,
        "invoked_function_arn": context.invoked_function_arn,
        "memory_limit_in_mb": context.memory_limit_in_mb,
        "aws_request_id": context.aws_request_id,
        "log_group_name": context.log_group_name,
        "log_stream_name": context.log_stream_name,
        "identity": {
            "cognito_identity_id": context.identity.cognito_identity_id,
            "cognito_identity_pool_id": context.identity.cognito_identity_pool_id,
        },
    }
    origin = event['headers']['origin']
    if origin not in config.ALLOWED_ORIGINS:
        return {
            "statusCode": 403,
            "headers": {
                "Content-Type": 'application/json',
            },
            "body": json.dumps(
                dict(isSuccess=False, reason='Not allowed origin')
            )
        }

    proxy = event['pathParameters']['proxy']
    body = json.loads(event['body']) if event['body'] else None
    claims = event['requestContext']['authorizer']['claims']
    params = dict(
        proxy=proxy,
        body=body,
        sub=claims['sub'],
        username=claims['cognito:username'],
    )
    try:
        route = router.get(proxy)
        if route:
            result = route(params)
        else:
            raise DataGiftException('No route matched')
        result['isSuccess'] = True
    except DataGiftException as ex:
        result = dict(isSuccess=False, reason=ex.reason)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Access-Control-Allow-Origin": origin,
        },
        "body": json.dumps(result),
    }

