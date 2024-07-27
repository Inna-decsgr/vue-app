import Vuex from 'vuex';



export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null // 토큰 상태
  },

  getters: {
    token: state => state.token
  }
});
