import config from '@/config'
import { buildUrl } from '@/utils'
import awsconfig from '@/aws-exports'

import endpoints from './endpoints'


function navigateTo(url, queryParams) {
  const urlWithQuery = buildUrl(endpoints.AWS_HOSTED_UI_ENDPOINT, queryParams);
  window.location.href = urlWithQuery;
}

export default {
  login(additions) {
    const queryParams = {
      response_type: awsconfig.Auth.oauth.responseType,
      client_id: awsconfig.Auth.userPoolWebClientId,
      redirect_uri: awsconfig.Auth.oauth.redirectSignIn,
      scope: 'email+openid+profile',
      ...additions
    };
    navigateTo(endpoints.AWS_HOSTED_UI_ENDPOINT, queryParams)
  },
  logout() {
    const params = {
      client_id: config.auth.USER_POOL_CLIENT_ID,
      logout_uri: config.auth.REDIRECT_SIGNOUT,
    };
    location.href = buildUrl(endpoints.AWS_LOGOUT_ENDPOINT, params);
  }
}
