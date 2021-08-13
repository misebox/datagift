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
  startDeleting(state, {filename, etag}) {
    const idx = state.items.findIndex(
      it => (it.filename === filename && it.etag === etag));
    if (idx >= 0) {
      state.items[idx].progress = 'deleting';
    }
  },
  endDeleting(state, item) {
    const idx = state.items.findIndex(
      it => (it.filename === filename && it.etag === etag));
    if (idx >= 0) {
      state.items[idx].progress = 'stored';
    }
  },
  deleteItem(state, {filename, etag}) {
    const idx = state.items.findIndex(
      it => (it.filename === filename && it.etag === etag));
    if (idx >= 0) {
      state.items.splice(idx, 1);
    }
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
        data.items.map(item => {item.progress = 'stored'});
        ctx.commit('setItems', data.items);
        ctx.commit('endLoading');
      })
      .catch(err => {
        console.error(err)
        ctx.commit('endLoading');
      })
  },
  deleteItem(ctx, {filename, etag}) {
    ctx.commit('startDeleting', {filename, etag});
    http.rest.deleteItem({filename, etag})
      .then(data => {
        ctx.commit('deleteItem', {filename, etag});
      })
      .catch(err => {
        console.error(err);
        ctx.commit('endDeleting', {filename, etag})
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
