import { createStore, createLogger } from 'vuex'
import auth from './modules/auth'
import gift from './modules/gift'

const debug = import.meta.env.MODE !== 'production'

const store = createStore({
  modules: {
    auth,
    gift,
  },
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
export default store;
