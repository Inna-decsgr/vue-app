<template>
  <div class="d-flex content-user">
    <div v-if="isLoggedIn && user">
      <img :src="user.photoURL" alt="User Photo" class="rounded-circle w-25 ms-2">
      <span class="ms-1">{{ user.displayName }}님</span>
    </div>
    <div>
      <button v-if="!isLoggedIn" @click="handleLoginWithGoogle" :disabled="loading" class="btn btn-primary">
      {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <button v-if="isLoggedIn" @click="handleLogout" class="btn btn-primary">Logout</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { auth, googleProvider, signInWithPopup } from '../api/firebase.js';

export default {
  computed: {
    ...mapGetters(['user', 'isLoggedIn', 'loading']),   
  },
  methods: {
    ...mapActions(['loginWithGoogle', 'logout', 'setUser', 'refreshToken']),

    async handleLoginWithGoogle() {
      this.$store.commit('setLoading', true); 
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
        // Vuex action을 직접 호출해서 로그인 처리 및 사용자 정보 저장
        await this.loginWithGoogle(user);

        // 서버에 인증 상태 확인 요청
        await this.checkAuthStatus();
        this.$router.push('/');  
      } catch (error) {
        alert('로그인에 실패했습니다. 다시 시도해보세요.');
        console.error('로그인 오류', error);
      } finally {
        this.$store.commit('setLoading', false);  
      }
    },

    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/');   
      } catch (error) {
        console.error('로그아웃 오류', error);
      }
    },

    async checkAuthStatus() {
      // 로컬 저장소에서 토큰을 확인하고 서버에 인증 상태를 확인하는 요청을 보내기
      try {
        const response = await this.$http.get('http://localhost:5000/api/protected', {
          withCredentials: true, // 쿠키도 함께 보내는 설정
        });

        if (response.status === 200) {
          // 인증 성공하면 Vuex 상태 업데이트
          this.$store.commit('setToken', localStorage.getItem('accessToken')); // accessToken으로 변경
          this.$store.commit('setRefreshToken', localStorage.getItem('refreshToken')); // refreshToken도 설정
          this.$store.commit('setUser', JSON.parse(localStorage.getItem('user'))); // 사용자 정보를 JSON으로 파싱하여 저장
        } 

      } catch (error) {
        console.error('인증 요청 또는 토큰 갱신 에러', error);

        try {// 토큰 갱신 시도
          await this.$store.dispatch('refreshToken');
        } catch (refreshError) {
          console.error('토큰 갱신 에러', refreshError);
          // 토큰 갱신 실패 시, 사용자 로그아웃 처리
          await this.handleLogout();
        }
      }
    },
    isTokenExpired(token) {
      if (!token) return true;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp < currentTime;
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');  

      if (user) {
        this.$store.commit('setUser', JSON.parse(user));  
      }

      if (token) {
        // 토큰 유효성을 확인하기 위해 서버에 요청을 보내는 대신, 토큰이 만료되었는지 확인
        const tokenExpired = this.isTokenExpired(token);

        if (tokenExpired) {
          try {
            await this.$store.dispatch('refreshToken');
          } catch (refreshError) {
            console.error('토큰 갱신 에러:', refreshError);
            await this.handleLogout();
          }
        }

        // 액세스 토큰이 유효하거나 갱신된 후, 인증 상태 확인
        await this.checkAuthStatus();
      }
    } catch (error) {
      console.error('Mounted hook error:', error)
    }
  },
};
</script>


<style>
@media (max-width: 767px) {
  .content-user {
    margin-top: 15px;
  }
}
</style>