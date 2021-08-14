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
  markItemAs(state, { filename, etag, progress }) {
    if (!['stored', 'deleting', 'downloading'].includes(progress)) {
      // Invalid progress
      return
    }
    const idx = state.items.findIndex(
      it => (it.filename === filename && it.etag === etag));
    if (idx < 0) {
      // Item not found
      return
    }
    state.items[idx].progress = progress;
  },
  startDeleting(state, { filename, etag }) {
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
  deleteItem(state, { filename, etag }) {
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
        data.items.map(item => { item.progress = 'stored' });
        ctx.commit('setItems', data.items);
        ctx.commit('endLoading');
      })
      .catch(err => {
        console.error(err)
        ctx.commit('endLoading');
      })
  },
  downloadItem(ctx, { filename, etag }) {
    ctx.commit('markItemAs', { filename, etag, progress: 'downloading' })
    http.rest.getDownloadingUrl({ filename, etag })
      .then(res => {
        http.client.get(res.url)
          .then(response => response.blob())
          .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
          })
          .finally(() => {
            ctx.commit('markItemAs', { filename, etag, progress: 'stored' })
          });
      })
      .catch(err => {
        console.error(err);
        ctx.commit('markItemAs', { filename, etag, progress: 'stored' })
      })
  },
  deleteItem(ctx, { filename, etag }) {
    ctx.commit('markItemAs', { filename, etag, progress: 'deleting' })
    http.rest.deleteItem({ filename, etag })
      .then(data => {
        ctx.commit('deleteItem', { filename, etag });
      })
      .catch(err => {
        console.error(err);
        ctx.commit('markItemAs', { filename, etag, progress: 'stored' })
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
