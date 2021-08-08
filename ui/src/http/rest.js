import awsconfig from '@/aws-exports'
import store from '@/store'

import client from './client'
import endpoints from './endpoints'


function authorizeCode({code, code_verifier}) {
  const bodyParams = {
    grant_type: 'authorization_code',
    client_id: awsconfig.Auth.userPoolWebClientId,
    code,
    code_verifier,
    redirect_uri,
  };
  return client.post(
    endpoints.AWS_TOKEN_ENDPOINT,
    {bodyParams}
  )
  .then((res) => (res.json()))
}

function postApi(path, jsonParams=null) {
  const idToken = store.getters['auth/idToken'];
  const options = {
    headers: {
      'Authorization': idToken,
    },
  };
  if (jsonParams) {
    options.jsonParams = jsonParams;
  }
  return (
    client.post(endpoints.API_BASEURL + path, options)
    .then(res => ( res.json() ))
  )
}


export default {
  authorizeCode,
  listItems: (payload) => postApi('/list_item', payload),
};
