<template>
  <div>
    <div class="mb-5">
      <h4>내가 찜한 영화</h4>
      <div v-if="loadingLikedMovies">로딩 중...</div>
      <div v-else>
        <MovieCarousel v-if="likedMovies.length" :movies="likedMovies" />
        <p v-else>찜한 영화가 없습니다.</p>
      </div>
    </div>
    <div>
      <h4>즐겨찾기한 영화</h4>
      <div v-if="loadingBookmarks">로딩 중...</div>
      <div v-else>
        <MovieCarousel v-if="bookmarkedMovies.length" :movies="bookmarkedMovies" />
        <p v-else>즐겨찾기한 영화가 없습니다.</p>
      </div>
    </div>
    <div>
      <h4>추천 영화</h4>
      <div v-if="loadingRecommendations">로딩 중...</div>
      <div v-else>
        <MovieCarousel v-if="recommendedMovies.length" :movies="recommendedMovies" />
        <p v-else>추천 영화가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import MovieCarousel from '../components/MovieCarousel';
import { removeDuplicates } from '@/utils/removeDuplicates';

export default {
  components: { MovieCarousel },
  data() {
    return {
      likedMovies: [],
      bookmarkedMovies: [],
      recommendedMovies: [],
      loadingLikedMovies: true,
      loadingBookmarks: true,
      loadingRecommendations: true,
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
            const likedMoviesResponse = await axios.get(`/likes/${this.userId}`);
            this.likedMovies = likedMoviesResponse.data;

            // 즐겨찾기 목록 가져오기
            const bookmarksResponse = await axios.get(`/bookmarks/${this.userId}`);
            this.bookmarkedMovies = bookmarksResponse.data;

            // 추천 영화 가져오기
            const recommendationsResponse = await axios.post('/recommendations', {
                likedMovies: this.likedMovies,
                bookmarkedMovies: this.bookmarkedMovies
            });
            this.recommendedMovies = removeDuplicates(recommendationsResponse.data, 'title');
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        } finally {
            this.loadingLikedMovies = false;
            this.loadingBookmarks = false;
            this.loadingRecommendations = false;
        }
    } else {
        console.error('사용자 ID가 없습니다.');
        this.loadingLikedMovies = false;
        this.loadingBookmarks = false;
        this.loadingRecommendations = false;
    }
}

};
</script>

<style scoped>
.movie-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
