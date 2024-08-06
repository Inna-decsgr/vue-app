<template>
  <div>
    <h3>장르별 영화</h3>
    <nav class="genrenav">
      <router-link to="/genre/액션" active-class="active-genre-link" class="genrerouter">액션</router-link>
      <router-link to="/genre/어드벤처" active-class="active-genre-link" class="genrerouter">어드벤처</router-link>
      <router-link to="/genre/애니메이션" active-class="active-genre-link" class="genrerouter">애니메이션</router-link>
      <router-link to="/genre/코미디" active-class="active-genre-link" class="genrerouter">코미디</router-link>
      <router-link to="/genre/드라마" active-class="active-genre-link" class="genrerouter">드라마</router-link>
      <router-link to="/genre/범죄" active-class="active-genre-link" class="genrerouter">범죄</router-link>
      <router-link to="/genre/다큐멘터리" active-class="active-genre-link" class="genrerouter">다큐멘터리</router-link>
      <router-link to="/genre/가족" active-class="active-genre-link" class="genrerouter">가족</router-link>
      <router-link to="/genre/판타지" active-class="active-genre-link" class="genrerouter">판타지</router-link>
      <router-link to="/genre/음악" active-class="active-genre-link" class="genrerouter">음악</router-link>
      <router-link to="/genre/로맨스" active-class="active-genre-link" class="genrerouter">로맨스</router-link>
      <router-link to="/genre/전쟁" active-class="active-genre-link" class="genrerouter">전쟁</router-link>
      <router-link to="/genre/역사" active-class="active-genre-link" class="genrerouter">역사</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'GenreOverview'
};
</script>

<style>
* {
  box-sizing: border-box;
}

.genrenav{
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 30px;
}

.genrerouter{
  border: 1px solid #5c5a5a;
  background-color: rgb(49, 45, 45);
  padding: 10px 30px;
  border-radius: 30px;
  white-space: nowrap;
  transition: transform 0.3s ease, background-color 0.3s ease; /* 애니메이션 추가 */
}

.genrerouter:hover {
  background-color: rgb(70, 68, 68); /* 배경색 변경 */
}

.active-genre-link {
  background-color: rgb(80, 77, 77);
}

/* 모바일 화면에서의 설정 */
@media (max-width: 577px) {
  .genrenav {
    display: flex;
    flex-wrap: nowrap; /* 줄 바꿈 방지 */
    overflow-x: auto; /* 수평 스크롤 추가 */
    margin: 20px 0;
    gap: 10px; /* 모바일에서의 간격 조정 */
  }
  .genrerouter {
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
    padding: 5px 10px; /* 모바일에서의 버튼 패딩 조정 */
    font-size: 0.8rem; /* 모바일에서의 글자 크기 조정 */
  }
}

/* 중간 화면에서의 설정 */
@media (min-width: 578px) and (max-width: 767px) {
  .genrenav {
    display: flex;
    flex-wrap: nowrap; /* 줄 바꿈 방지 */
    overflow-x: auto; /* 수평 스크롤 추가 */
    margin: 20px 0;
    gap: 10px; /* 중간 화면에서의 간격 조정 */
  }
  .genrerouter {
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
    padding: 5px 10px; /* 중간 화면에서의 버튼 패딩 조정 */
    font-size: 0.8rem; /* 중간 화면에서의 글자 크기 조정 */
  }
}

/* 큰 화면에서의 설정 */
@media (min-width: 768px) and (max-width: 991px) {
  .genrenav {
    display: flex;
    flex-wrap: nowrap; /* 줄 바꿈 방지 */
    overflow-x: auto; /* 수평 스크롤 추가 */
    margin: 20px 0;
    gap: 20px; /* 큰 화면에서의 간격 조정 */
  }
  .genrerouter {
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
    padding: 10px 20px; /* 큰 화면에서의 버튼 패딩 조정 */
    font-size: 0.9rem; /* 큰 화면에서의 글자 크기 조정 */
  }
}

/* 더 큰 화면에서의 설정 */
@media (min-width: 992px) {
  .genrenav {
    display: flex;
    flex-wrap: nowrap; /* 줄 바꿈 방지 */
    overflow-x: auto; /* 수평 스크롤 추가 */
    margin: 20px 0;
    gap: 30px; /* 큰 화면에서의 간격 조정 */
  }
  .genrerouter {
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
    padding: 10px 30px; /* 큰 화면에서의 버튼 패딩 조정 */
    font-size: 1rem; /* 큰 화면에서의 글자 크기 조정 */
  }
}
</style>