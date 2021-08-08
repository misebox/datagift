import router from '@/router.js'
import http from '@/http'
import awsconfig from '@/aws-exports'
import {
  getRandomString,
  generateCodeChallenge,
  buildUrl,
} from '@/utils'

import auth from './auth'
import config from '@/config'

const state = {
  items: []
};

const getters = {
  items() {
    return state.items
  }
};
const mutations = {
  setItems(state, items) {
    state.items = items
  }
};


const actions = {
  getItems(ctx) {
    const idToken = auth.getters.idToken();
    http.post(
      config.API_BASEURL + '/list_item',
      {},
      {
        headers: {
          'Authorization': 'Bearer ' + idToken,
        },
      }
    ).then(res => res.json())
    .then(data => {
      console.log(data);
      ctx.commit('setItems', data);
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
