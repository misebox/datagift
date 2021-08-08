import http from '@/http'

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
    http.rest.listItems({testField:'aaa'})
    .then(data => {
      console.log(data)
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
