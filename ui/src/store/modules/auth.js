import http from '@/http'
import {
  getRandomString,
  generateCodeChallenge,
} from '@/utils'


const state = {
  idToken: '',
  accessToken: '',
  refreshToken: '',
  expiresAt: null,
};

const getters = {
  isLoggedIn: state => (!!state.idToken),
  idToken: state => (state.idToken),
  accessToken: state => (state.accessToken),
  refreshToken: state => (state.refreshToken),
  expiresAt: state => (state.expiresAt),
};
const mutations = {
  setTokens(state, payload) {
    state.idToken = payload.id_token;
    state.accessToken = payload.access_token;
    if (payload.refresh_token) {
      state.refreshToken = payload.refresh_token;
    }
    if (payload.expires_in) {
      state.expiresAt = new Date((new Date()).getTime() + payload.expires_in * 1000)
    }
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
    const formParams = {
      code,
      code_verifier: authInfo.codeVerifier,
    };
    http.rest.authorizeCode(formParams)
    .then((tokens) => {
      ctx.commit('setTokens', tokens)
    })
    .catch((res) => {
      ctx.dispatch('logout')
    });
  },
  refreshToken(ctx) {
    const params = {
      refresh_token: ctx.getters['refreshToken']
    };
    http.rest.refreshToken(params)
    .then(data => {
      ctx.commit('setTokens', data)
    })
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