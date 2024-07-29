import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    loading: false,
  },

  getters: {
    token: state => state.token,  // token에 state.token을 반환
    user: state => state.user,  // user에 state.user를 반환
    isLoggedIn: state => !!state.token,  // 사용자가 로그인했는지 여부 판단, 토큰이 존재하면 true, 그렇지 않으면 false
    loading: state => state.loading  // 로딩 상태 반환
  },

  mutations: {
    setToken(state, token) {  // 매개변수로 받은 token을 state.token와 localStorage에 저장
      state.token = token;
      console.log('setToken 뮤테이션 실행', token);
    },
    setUser(state, user) {  // 매개변수로 받은 user 정보를 state.user와 localStorage에 저장
      state.user = user;
      console.log('setUser 뮤테이션 실행', user);
    },
    logout(state) {
      state.token = null;   // state.token과 state.user를 null로 설정해서 상태 초기화
      state.user = null;
      console.log('logout 뮤테이션 실행');
    },
    setLoading(state, loading) {   // 로딩 상태를 설정하는 뮤테이션
      state.loading = loading;
      console.log('setLoading 뮤테이션 실행', loading);
    }
  },

  actions: {
    async loginWithGoogle({ commit }, user) {  // 매개변수로 받은 user 정보를 이용해서 백엔드 서버에 로그인 요청을 보냄
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });

      // 로그인 요청 후 JWT 토큰 상태 저장
      const token = response.data.token;  // 백엔드 서버에서 JWT 토큰을 응답받아 
      commit('setToken', token);  // SetToken 뮤테이션을 호출해서 token 상태 저장
      // 이후 API 요청 시 토큰을 포함하기 위해 axios 기본 헤더에 Authorization 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      
      // 사용자 정보를 저장하거나 업데이트
      await axios.post('http://localhost:5000/api/users', user);
      // setUser 뮤테이션 호출해서 Vuex 스토어에 사용자 정보 저장
      commit('setUser', user);
      console.log('로그인하고 사용자 정보 저장:', user);
    },
    async logout({ commit }) {
      await axios.post('http://localhost:5000/api/auth/logout');
      commit('logout');
      localStorage.removeItem('token');  // 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem('user');   // 로컬 스토리지에서 사용자 정보 삭제
      delete axios.defaults.headers.common['Authorization'];
      console.log('사용자 로그아웃');
    }
  },

  plugins: [createPersistedState({
    paths: ['token', 'user'], // user와 token을 localStorage에서 복원, 상태를 저장할 경로 지정(기본 설정은 모든 상태를 저장)
    key: 'vuex',
  })]
  // createPersistedState() vuex-persistedstate의 기본 설정으로 상태를 자동으로 localStorage에 저장하고 복원한다.
  // Vuex 스토어의 플로그인 배열에 createPersistedState를 추가해서 상태를 유지하도록 설정
});
