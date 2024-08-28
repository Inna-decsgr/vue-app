import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null, 
    user: null,
    loading: false,
  },

  getters: {
    accessToken: state => state.accessToken, 
    refreshToken: state => state.refreshToken, 
    user: state => state.user,  
    isLoggedIn: state => !!state.accessToken,  // 사용자가 로그인했는지 여부 판단, 토큰이 존재하면 true, 그렇지 않으면 false
    loading: state => state.loading  
  },

  mutations: {
    setToken(state, accessToken) {  // 매개변수로 받은 token을 state.token와 localStorage에 저장
      state.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken); 
    },
    setRefreshToken(state, refreshToken) {  
      state.refreshToken = refreshToken;
      localStorage.setItem('refreshToken', refreshToken); 
    },
    setUser(state, user) {  
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); 
    },
    logout(state) {
      state.accessToken = null;   
      state.refreshToken = null;  
      state.user = null;
      localStorage.removeItem('accessToken'); 
      localStorage.removeItem('refreshToken'); 
      localStorage.removeItem('user'); 
    },
    setLoading(state, loading) {   
      state.loading = loading;
    }
  },

  actions: {
    async loginWithGoogle({ commit }, user) { 
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });

        const { accessToken, refreshToken } = response.data;  

        commit('setToken', accessToken);  
        commit('setRefreshToken', refreshToken);  
        commit('setUser', user);

        // 이후 API 요청 시 토큰을 포함하기 위해 axios 기본 헤더에 Authorization 설정
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      
        // 사용자 정보를 저장하거나 업데이트
        await axios.post('http://localhost:5000/api/users', user);
      } catch (error) {
        console.error('로그인 오류', error);
        throw error;
      }
    },
    async refreshToken({ commit, state }) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/refresh', {
          refreshToken: state.refreshToken
        });

        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data; // 서버에서 새 access token과 refresh token을 받아옴

          commit('setToken', accessToken);
          commit('setRefreshToken', refreshToken);
          
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
          console.log('새로운 accessToken 발급 실패')
        }
      } catch (error) {
        console.error('토큰 새로 고침 오류', error);
        throw error;
      }
    },
    async logout({ commit }) {
      await axios.post('http://localhost:5000/api/auth/logout');
      commit('logout');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  plugins: [createPersistedState({
    paths: ['refreshToken', 'user'], // user와 token을 localStorage에서 복원, 상태를 저장할 경로 지정(기본 설정은 모든 상태를 저장)
    key: 'vuex',
  })]
  // createPersistedState() vuex-persistedstate의 기본 설정으로 상태를 자동으로 localStorage에 저장하고 복원
  // Vuex 스토어의 플로그인 배열에 createPersistedState를 추가해서 상태를 유지하도록 설정
});
