import http from '@/http'
import config from '@/config'

const state = {
  cacheExpiresAt: null,
  items: []
};

const getters = {
  isCacheExpired: state => {
    const now = new Date();
    if (!state.cacheExpiresAt || state.cacheExpiresAt < now) {
      // cache has expired
      return true
    } else {
      // cache is ready
      return false
    }
  },
  items: state => state.items,
};
const mutations = {
  setItems(state, items) {
    state.items = items;
    const utcnow = new Date();
    state.cacheExpiresAt = new Date(utcnow.getTime() + config.MIN_API_INTERVAL * 1000);
  }
};


const actions = {
  listItems(ctx) {
    http.rest.listItems({testField:'aaa'})
    .then(data => {
      console.log(data)
      ctx.commit('setItems', data.items);
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
