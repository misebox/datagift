import json
import boto3


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
        #"client_context": {
        #    "installation_id": context.client.installation_id,
        #    "app_title": context.client.app_title,
        #    "app_version_name": context.client.app_version_name,
        #    "app_version_code": context.client.app_version_code,
        #    "app_package_name": context.client.app_package_name,
        #},
        #"custom": context.custom,
        #"env": context.env,
    }
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "hello world",
                "path": event.get('path'),
                "event": event,
                "context": ctx,
            }
        ),
    }

