<template>
  <div>
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script>
import axios from 'axios';
import { auth, googleProvider, signInWithPopup } from '../api/firebase.js';

export default {
  methods: {
    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // 사용자 정보를 백엔드 서버로 전송
        await axios.post('http://localhost:5000/api/users', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        })

        console.log('User:', user);
        this.$router.push('/')
      } catch (error) {
        console.error("Error signing in:".error);
      }
    }
  }
};
</script>
