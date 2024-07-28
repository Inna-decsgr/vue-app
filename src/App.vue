<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/latest">최신 영화</router-link> |
      <router-link to="/genre">장르별 영화</router-link>
      <UserLogin />
    </nav>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import UserLogin from './components/UserLogin.vue'

export default {
  components: {
    UserLogin
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
