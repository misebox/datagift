import awsconfig from '@/aws-exports'
import store from '@/store'

import client from './client'
import endpoints from './endpoints'
import navigator from './navigator'


function postApi(path, jsonParams=null, headers={}) {
  const idToken = store.getters['auth/idToken'];
  const defaultOptions = {
    headers: {
      'Authorization': 'Bearer ' + idToken,
      ...headers,
    },
    mode: 'cors'
  };
  const options = {...defaultOptions};
  if (jsonParams) {
    options.jsonParams = jsonParams;
  }
  return (
    client.post(endpoints.API_BASEURL + path, options)
    .then(res => ( res.json() ))
    .catch(err => {
      console.log('err:',err)
      client.post(endpoints.API_BASEURL + '/', defaultOptions)
      .then(res => {
        console.log('Authorized')
      })
      .catch(err => {
        console.log('Authorization failed, loggout now.', err)
        navigator.logout()
      })
    })
  )
}


function authorizeCode({code, code_verifier}) {
  const formParams = {
    grant_type: 'authorization_code',
    client_id: awsconfig.Auth.userPoolWebClientId,
    redirect_uri: awsconfig.Auth.oauth.redirectSignIn,
    code,
    code_verifier,
  };
  return client.post(
    endpoints.AWS_TOKEN_ENDPOINT,
    {formParams}
  )
  .then((res) => (res.json()))
}

function refreshToken({refresh_token}) {
  const formParams = {
    grant_type: 'refresh_token',
    client_id: awsconfig.Auth.userPoolWebClientId,
    refresh_token,
  };
  return client.post(
    endpoints.AWS_TOKEN_ENDPOINT,
    {formParams}
  )
  .then((res) => (res.json()))
}

export default {
  authorizeCode,
  refreshToken,
  listItems: (payload) => postApi('/store/list_items', payload),
  getUploadingUrl: (payload) => postApi('/store/uploading_url', payload),
  getUser: (payload) => postApi('/user/self'),
};
