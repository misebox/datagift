import router from '@/router.js'
import http from '@/http'
import awsconfig from '@/aws-exports'
import config from '@/config'
import {
  getRandomString,
  generateCodeChallenge,
  buildUrl,
} from '@/utils'


const AWS_AUTHORIZATION_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/oauth2/authorize';
const AWS_HOSTED_UI_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/login';
const AWS_TOKEN_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/oauth2/token';
const AWS_LOGOUT_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/logout';
const API_BASEURL = import.meta.env.VITE_API_BASEURL

const state = {
  idToken: '',
  accessToken: '',
  refreshToken: '',
};

const getters = {
  isLoggedIn() {
    return !!state.accessToken
  },
  idToken: () => (state.idToken),
  accessToken: () => (state.accessToken),
  refreshToken: () => (state.refreshToken),
};
const mutations = {
  setTokens(state, payload) {
    state.accessToken = payload.access_token;
    state.refreshToken = payload.refresh_token;
    state.idToken = payload.id_token;
    window.sessionStorage.removeItem('authInfo')
  },
};


const actions = {

  jumpToAuthorize() {
    const codeVerifier = getRandomString(16);
    generateCodeChallenge(codeVerifier)
    .then((codeChallenge) => {
      const authInfo = {
        state: getRandomString(16),
        codeChallengeMethod: 'S256',
        codeChallenge,
        codeVerifier,
      };
      window.sessionStorage.setItem('authInfo', JSON.stringify(authInfo))
      const params = {
        response_type: awsconfig.Auth.oauth.responseType,
        client_id: awsconfig.Auth.userPoolWebClientId,
        redirect_uri: awsconfig.Auth.oauth.redirectSignIn,
        scope: 'email+openid+profile',
        state: authInfo.state,
        code_challenge_method: authInfo.codeChallengeMethod,
        code_challenge: authInfo.codeChallenge,
      };

      const url = buildUrl(AWS_HOSTED_UI_ENDPOINT, params);
      console.log('url', url)
      window.location.href = url;
    })
  },
  authorizeCode(ctx, {code}) {
    const authInfo = JSON.parse(window.sessionStorage.getItem('authInfo'));
    if (!authInfo) {
      ctx.dispatch('logout')
      return
    }
    const data = {
      grant_type: 'authorization_code',
      client_id: awsconfig.Auth.userPoolWebClientId,
      code,
      code_verifier: authInfo.codeVerifier,
      redirect_uri: awsconfig.Auth.oauth.redirectSignIn,
    };
    const params = new URLSearchParams();
    Object.entries(data).map(([k, v]) => {
      params.append(k, v)
    });
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    http.post(AWS_TOKEN_ENDPOINT, params, {headers})
    .then((res) => (res.json()))
    .catch((res) => {
      ctx.dispatch('logout')
    }).then((tokens) => {
      ctx.commit('setTokens', tokens)
      window.sessionStorage.setItem('tokens', JSON.stringify(tokens))
    })
  },
  loginWithCode(ctx, {code}) {
    http.post(API_BASEURL + '/hello', {
      param1: 'sample'
    }).then(res => {
      console.log(res.json())
    })

  },
  logout() {
    console.log('LOGOUT')
    window.sessionStorage.removeItem('tokens');
    window.sessionStorage.removeItem('authInfo');
    const params = {
      client_id: config.auth.USER_POOL_CLIENT_ID,
      logout_uri: config.auth.REDIRECT_SIGNOUT,
    };
    location.href = buildUrl(AWS_LOGOUT_ENDPOINT, params);
  },
  tryGetTokens(ctx) {
    let item;
    if (item = window.sessionStorage.getItem('tokens')) {
      const tokens = JSON.parse(item);
      ctx.commit('setTokens', tokens)
    }
    if (item = window.sessionStorage.getItem('authInfo')) {
      const authInfo = JSON.parse(item);
      ctx.dispatch('authorizeCode', authInfo)
    }
  }
}

const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
export default auth;