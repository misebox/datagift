import http from '@/http'
import {
  getRandomString,
  generateCodeChallenge,
} from '@/utils'


const state = {
  idToken: '',
  accessToken: '',
  refreshToken: '',
};

const getters = {
  isLoggedIn: state => !!state.idToken,
  idToken: state => state.idToken,
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
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
      const queryParams = {
        state: authInfo.state,
        code_challenge_method: authInfo.codeChallengeMethod,
        code_challenge: authInfo.codeChallenge,
      };
      http.navigator.login(queryParams);
    })
  },
  authorizeCode(ctx, {code}) {
    const authInfo = JSON.parse(window.sessionStorage.getItem('authInfo'));
    if (!authInfo) {
      ctx.dispatch('logout')
      return
    }
    const bodyParams = {
      code,
      code_verifier: authInfo.codeVerifier,
    };
    http.rest.authorizeCode({...bodyParams})
    .then((tokens) => {
      ctx.commit('setTokens', tokens)
      window.sessionStorage.setItem('tokens', JSON.stringify(tokens))
    })
    .catch((res) => {
      ctx.dispatch('logout')
    });
  },
  logout() {
    console.log('LOGOUT')
    window.sessionStorage.removeItem('tokens');
    window.sessionStorage.removeItem('authInfo');
    http.navigator.logout()
  },
  tryGetTokens(ctx) {
    let item;
    if (item = window.sessionStorage.getItem('tokens')) {
      const tokens = JSON.parse(item);
      ctx.commit('setTokens', tokens)
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