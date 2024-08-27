<template>
  <div id="id">
    <div class="content-wrapper">
      <nav class="content-nav d-flex justify-content-between align-items-center">
        <div class="fs-5 content-router">
          <router-link to="/" class="nav-link" active-class="active-link">홈</router-link> |
          <router-link to="/latest" class="nav-link" active-class="active-link">최신 영화</router-link> |
          <router-link to="/genre" class="nav-link" active-class="active-link">장르별 영화</router-link> |
          <router-link to="/search" class="nav-link" active-class="active-link">검색</router-link>
        </div>
        <div class="fs-5 d-flex align-items-center content-router">
          <router-link v-if="accessToken" to="/mypage" class="nav-link" active-class="active-link">+ 관심 컨텐츠</router-link>
          <UserLogin />
        </div>
      </nav>
      <div class="mt-5">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import UserLogin from './components/UserLogin.vue'
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['accessToken']), 
  },
  components: {
    UserLogin
  }
}
</script>

<style>
#id {
  color: white;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 최소 높이를 화면 높이로 설정 */ 
  padding: 50px 200px; 
  background-color: rgb(0, 0, 0); 
  color: white; 
}

ol, ul {
  list-style: none;
  padding: 0 !important;  
  margin: 0;
}

a {
  color: white;
  text-decoration: none;
}

.nav-link {
  display: inline-block; 
  color: white; 
  padding: 5px 15px;
  line-height: 1.5; 
  transition: all 0.3s ease; 
}

.active-link {
  font-weight: bold;
  border-bottom: 2px solid white;
  padding-bottom: 3px;

}


@media (max-width: 767px) {
  .content-wrapper {
    padding: 20px !important; 
  }
  .content-nav {
    font-size: 1rem !important;
    display: inline-block !important;
  }
  .nav-link {
    padding: 2px 5px;
  }
  .active-link {
    font-size: 1rem !important;
  }
  .content-router {
    font-size: 1rem !important;
    display: block !important; 
  }
}

@media (min-width: 768px) and (max-width: 1110px) {
  .content-wrapper {
    padding: 20px !important; 
  }
  .active-link, .content-router   {
    font-size: 1rem !important;
  }
}


</style>
