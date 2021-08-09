import http from '@/http'
import config from '@/config'

const state = {
  cacheExpiresAt: null,
  loading: false,
  items: [],
};

const getters = {
  isLoading: (state) => (state.loading),
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
  items: (state) => (state.items),
};
const mutations = {
  startLoading(state) {
    state.loading = true;
  },
  endLoading(state) {
    state.loading = false;
  },
  setItems(state, items) {
    state.items = items;
    const utcnow = new Date();
    state.cacheExpiresAt = new Date(utcnow.getTime() + config.MIN_API_INTERVAL * 1000);
  }
};


const actions = {
  listItems(ctx) {
    ctx.commit('startLoading');
    http.rest.listItems()
      .then(data => {
        ctx.commit('setItems', data.items);
        ctx.commit('endLoading');
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
