import { createStore, createLogger } from 'vuex'
import auth from './modules/auth'
import gift from './modules/gift'
import files from './modules/files'

const debug = import.meta.env.MODE !== 'production'

const store = createStore({
  modules: {
    auth,
    gift,
    files,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
export default store;
