<template>
  <div>
    <button v-if="!isLoggedIn" @click="loginWithGoogle" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login with Google' }}
    </button>
    <button v-if="isLoggedIn" @click="logout">Logout</button>
  </div>
</template>

<script>

import { auth, googleProvider, signInWithPopup } from '../api/firebase.js';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['token'])
  },
  data() {
    return {
      isLoggedIn: false,
      loading: false,
    }
  },
  methods: {
    async loginWithGoogle() {
      this.loading = true;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // 사용자 정보를 백엔드 서버로 전송
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }, { withCredentials: true });

        // 로그인 요청 후 JWT 토큰 저장
        const token = response.data.token;
        localStorage.setItem('token', token); 

        // 이후 API 요청에 토큰 포함
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 사용자 정보를 저장하거나 업데이트
        await axios.post('http://localhost:5000/api/users', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }, { withCredentials: true });

        this.isLoggedIn = true;
        this.$router.push('/')
        console.log("로그인성공", token);
      } catch (error) {
        console.error('Error signing in:', error);
        alert('로그인에 실패했습니다. 다시 시도해보세요.')
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:5000/api/auth/logout');

        // 클라이언트 저장소에서 토큰 삭제
        localStorage.removeItem('token');

         // Axios 기본 헤더에서 토큰 제거
        delete axios.defaults.headers.common['Authorization']; 

        // 로그인 상태 업데이트하고 리디렉션
        this.isLoggedIn = false;
        this.$router.push('/login');
        console.log("로그아웃", this.token);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
    async checkAuthStatus() {
      // 사용자 인증 사태 확인하고 로그인 상태 유지하는 함수
      try {
        // 서버에 인증 상태를 확인하는 요청 보내기
        const response = await axios.get('http://localhost:5000/api/protected', {
          withCredentials: true  // 브라우저가 쿠키를 포함시켜 요청
        });

        // 응답이 성공적이면 로그인 상태를 업데이트
        if (response.status === 200) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      } catch (error) {
        // 에러가 발생하면 로그인 상태를 false를 설정
        this.isLoggedIn = false;
        console.error('Authentication check failed:', error);
      }
    }
  },
  async mounted() {
    // 로컬 저장소에서 토큰 확인
    const token = localStorage.getItem('token');

    // 토큰이 있을 때만 인증 상태 확인
    if (token) {
      await this.checkAuthStatus();
    }
  }
};
</script>
