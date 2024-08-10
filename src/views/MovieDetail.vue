<template>
  <div v-if="movie" class="movie-container">
    <div class="movie-info">
      <h1 class="movie-title">{{ movie.title }}</h1>
      <ul class="movie-list">
        <li><strong>감독:</strong> {{ movie.director }}</li>
        <li><strong>출연진:</strong> {{ movie.cast.join(', ') }}</li>
        <li><strong>개봉 날짜:</strong> {{ movie.release_date }}</li>
        <li><strong>평점:</strong> {{ movie.rating }}</li>
      </ul>
      <p class="movie-desc">{{ movie.description }}</p>
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-danger" @click="likeMovie">찜</button>
        <button type="button" class="btn btn-warning" @click="Bookmarks">즐겨찾기</button>
        <button type="button" class="btn btn-secondary">리뷰 작성</button>
      </div>
    </div>
    <img :src="movie.poster_url" :alt="movie.title" class="movie-poster" />
  </div>
  <div v-else>
    <p>영화 정보를 로딩 중입니다...</p>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      movie: null,
    };
  },
  computed: {
    ...mapGetters(['user']),
    userId() {
      return this.user ? this.user.uid : null;
    },
    movieId() {
      return this.$route.params.id;
    }
  },
  watch: {
    movieId(newId) {
      this.fetchMovie(newId);
    }
  },
  methods: {
    async fetchMovie(id) {
      try {
        const response = await axios.get(`/movies/${id}`);
        this.movie = response.data;
        console.log(response.data);
      } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류 발생:', error);
      }
    },
    async likeMovie() {
      if (!this.userId) {
        console.error('사용자 ID가 없습니다.');
        return;
      }

      try {
        const response = await axios.post('/likes', {
          uid: this.userId,
          movieId: this.movieId,
          title: this.movie.title,
          imageUrl: this.movie.poster_url
        });
        console.log(response.data.message);
        alert("영화가 성공적으로 찜 되었습니다!");
      } catch (error) {
        console.error('영화 찜하기 중 오류 발생:', error);
      }
    },

    async Bookmarks() {
      try {
        const response = await axios.post('/bookmarks', {
          uid: this.userId,
          movieId: this.movieId,
          title: this.movie.title,
          imageUrl: this.movie.poster_url
        });
        console.log(response.data.message);
        alert("영화가 성공적으로 즐겨찾기 되었습니다!");
      } catch (error) {
        console.error('영화 즐겨찾기 중 오류 발생:', error);
      }
    }
  },
  created() {
    this.fetchMovie(this.movieId);
  }
};
</script>

<style>
.movie-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.movie-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.movie-list {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.movie-desc {
  font-size: 1.25rem;
  margin-bottom: 50px;
}


@media (min-width: 768px) {
  .movie-container {
    flex-direction: row;
    align-items: stretch;
  }

  .movie-desc {
    max-width: 600px;
  }

}
</style>
