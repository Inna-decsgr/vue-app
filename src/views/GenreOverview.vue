<template>
  <div>
    <h1>장르별 영화</h1>
    <p>원하는 장르를 선택하세요.</p>
    <nav>
      <router-link to="/genre/action">액션</router-link>
      <router-link to="/genre/Adventure">어드벤처</router-link>
      <router-link to="/genre/Animation">애니메이션</router-link>
      <router-link to="/genre/Comedy">코미디</router-link>
      <router-link to="/genre/drama">드라마</router-link>
      <router-link to="/genre/crime">범죄</router-link>
      <router-link to="/genre/Documentary">다큐멘터리</router-link>
      <router-link to="/genre/Family">가족</router-link>
      <router-link to="/genre/Fantasy">판타지</router-link>
      <router-link to="/genre/Music">음악</router-link>
      <router-link to="/genre/Romance">로맨스</router-link>
      <router-link to="/genre/War">전쟁</router-link>
      <router-link to="/genre/History">역사</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'GenreOverview'
};
</script>
