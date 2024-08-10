<template>
  <div>
    <div>
      <h2>내가 찜한 영화</h2>
      <div v-if="loadingLikedMovies">로딩 중...</div>
        <div v-else>
          <MovieCarousel 
          v-if="likedMovies.length" 
          :movies="likedMovies" 
        />
        <p v-else>찜한 영화가 없습니다.</p>
      </div>
    </div>
    <div>
      <h2>즐겨찾기한 영화</h2>
      <div v-if="loadingBookmarks">로딩 중...</div>
        <div v-else>
          <MovieCarousel 
          v-if="bookmarkedMovies.length" 
          :movies="bookmarkedMovies" 
        />
        <p v-else>즐겨찾기한 영화가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import MovieCarousel from '../components/MovieCarousel';

export default {
  components: { MovieCarousel },
  data() {
    return {
      likedMovies: [],
      bookmarkedMovies: [],
      loadingLikedMovies: true,
      loadingBookmarks: true,
    };
  },
  computed: {
    ...mapGetters(['user']),
    userId() {
      return this.user ? this.user.uid : null;
    },
  },
  async created() {
    if (this.userId) {
      try {
        // 찜한 영화 목록 가져오기
        const likedMoviesResponse  = await axios.get(`/likes/${this.userId}`);
        this.likedMovies = likedMoviesResponse .data;
        
        // 즐겨찾기 목록 가져오기
        const bookmarksResponse = await axios.get(`/bookmarks/${this.userId}`);
        this.bookmarkedMovies = bookmarksResponse.data;


        console.log('찜한 영화 목록:', this.likedMovies); // 데이터 확인
        console.log('즐겨찾기 목록:', this.bookmarkedMovies); // 데이터 확인
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        this.loadingLikedMovies = false;
        this.loadingBookmarks = false;
      }
    } else {
      console.error('사용자 ID가 없습니다.');
      this.loadingLikedMovies = false;
      this.loadingBookmarks = false;
    }
  },
};
</script>

<style scoped>
.movie-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
