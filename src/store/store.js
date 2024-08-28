import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null,  // 새로운 상태 추가: refresh token
    user: null,
    loading: false,
  },

  getters: {
    accessToken: state => state.accessToken,  // accessToken state.accessToken으로 반환
    refreshToken: state => state.refreshToken, // 새로 추가된 getter
    user: state => state.user,  // user에 state.user를 반환
    isLoggedIn: state => !!state.accessToken,  // 사용자가 로그인했는지 여부 판단, 토큰이 존재하면 true, 그렇지 않으면 false
    loading: state => state.loading  // 로딩 상태 반환
  },

  mutations: {
    setToken(state, accessToken) {  // 매개변수로 받은 token을 state.token와 localStorage에 저장
      state.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken); // 로컬 스토리지에 저장
    },
    setRefreshToken(state, refreshToken) {  // 새로 추가된 mutation
      state.refreshToken = refreshToken;
      localStorage.setItem('refreshToken', refreshToken); // 로컬 스토리지에 저장
    },
    setUser(state, user) {  // 매개변수로 받은 user 정보를 state.user와 localStorage에 저장
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // 로컬 스토리지에 저장 (객체를 문자열로 변환)
    },
    logout(state) {
      state.accessToken = null;   // state.token과 state.user를 null로 설정해서 상태 초기화
      state.refreshToken = null;  // 로그아웃 시 refresh token도 초기화
      state.user = null;
      localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('refreshToken'); // 로컬 스토리지에서 리프레시 토큰 제거
      localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 제거
    },
    setLoading(state, loading) {   // 로딩 상태를 설정하는 뮤테이션
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
  // createPersistedState() vuex-persistedstate의 기본 설정으로 상태를 자동으로 localStorage에 저장하고 복원한다.
  // Vuex 스토어의 플로그인 배열에 createPersistedState를 추가해서 상태를 유지하도록 설정
});
