<template>
  <div class="movie-detail">
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

        <div class="btn-small-group mt-4" role="group" aria-label="Large button group">
          <button type="button" class="btn btn-outline-warning" @click="likeMovie">+ 보고싶어요</button>
          <button type="button" class="btn btn-outline-warning" @click="Bookmarks">즐겨찾기</button>
          <button v-if="!myReview.length" type="button" class="btn btn-outline-warning" @click="toggleForm">리뷰 작성</button>
        </div>
      </div>
      <img :src="movie.poster_url" :alt="movie.title" class="movie-poster" />
    </div>
    <div v-else>
      <p>영화 정보를 로딩 중입니다...</p>
    </div>

    <div v-if="isFormVisible" class="form-overlay">
      <div class="form-container">
        <form @submit.prevent="submitReview">
          <label for="exampleFormControlTextarea1" class="form-label">
            {{ user.displayName }}
          </label>
          <textarea
            v-model="reviewContent"
            class="form-control mb-3" 
            id="exampleFormControlTextarea1"
            placeholder="영화 감상평을 입력해보세요"
            rows="3"
          ></textarea>
          <div class="btn-group btn-group-lg" role="group" aria-label="Large button group">
            <button type="button" class="btn btn-outline-warning" @click="toggleForm">취소</button>
            <button type="submit" class="btn btn-outline-warning">{{ isEditMode ? '수정' : '제출' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div class="users-comment">
      <div class="myreview">
        <h5 class="fw-bold mb-4">내가 작성한 관람평</h5>
        <div v-if="myReview.length" class="myreview">
          <p v-for="(review, index) in myReview" :key="index">
            <span class="author">나: </span>
            <span class="review">{{ review.comments }}</span>
            <button @click="editReview(review)" class="btn btn-outline-warning edit">수정</button>
            <button @click="removeReview(movie.title, userId, review.comments)" class="btn btn-outline-warning remove">삭제</button><br/>
            <span class="date">{{ formatDate(review.date) }}</span>
          </p>
        </div>
        <div v-else>
          <p>아직 관람평을 작성하지 않았어요.</p>
        </div>
      </div>

      <div class="othersreview">
        <h5 class="fw-bold mb-4">다른 사용자들의 평</h5>
        <div v-if="otherReviews.length">
          <p v-for="(review, index) in otherReviews" :key="index">
            <span class="author">{{ review.userName }}: </span>
            <span class="review">{{ review.comments }}</span><br/>
            <span class="date">{{ formatDate(review.date) }}</span>
          </p>
        </div>
        <div v-else>
          <p>다른 사용자들이 작성한 관람평이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>





<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { formatDate } from '@/utils/formatDate';

export default {
  data() {
    return {
      movie: null,
      isFormVisible: false,
      reviewContent: '',
      myReview: [],
      otherReviews: [],
      isEditMode: false,
      editingReview: null,
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
    formatDate(dateString) {
      return formatDate(dateString);
    },
    async fetchMovie(id) {
      try {
        const response = await axios.get(`/movies/${id}`);
        this.movie = response.data;

        if (this.movie && this.userId) {
          this.fetchReview(this.movie.title, this.userId)
        }
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
          imageUrl: this.movie.poster_url,
          director: this.movie.director,
          cast: this.movie.cast,
          genres: this.movie.genres
        });
        alert(response.data.message);
      } catch (error) {
        alert(error.response.data.message || '서버에서 오류가 발생했습니다.');
      }
    },

    async Bookmarks() {
      try {
        const response = await axios.post('/bookmarks', {
          uid: this.userId,
          movieId: this.movieId,
          title: this.movie.title,
          imageUrl: this.movie.poster_url,
          movieTitle: this.movie.title,
          director: this.movie.director,
          cast: this.movie.cast,
          genres: this.movie.genres
        });
        alert(response.data.message);
      } catch (error) {
        console.error('영화 즐겨찾기 중 오류 발생:', error);
      }
    },
    async toggleForm() {
      this.isFormVisible = !this.isFormVisible;
      if (!this.isFormVisible) {
        this.resetForm();
      }
    },
    async submitReview() {
      if (!this.reviewContent.trim()) {
        alert('리뷰 내용을 입력해 주세요.');
        return;
      }

      try {
        const endpoint = this.isEditMode ? '/reviews/update' : '/reviews/add';
        const response = await axios.post(endpoint, {
          movieTitle: this.movie.title,
          userId: this.userId,
          userName: this.user.displayName,
          comments: this.reviewContent,
          reviewId: this.editingReview ? this.editingReview._id : null, 
        });

        alert(response.data.message);
        this.isFormVisible = false;
        this.resetForm();
        this.fetchReview(this.movie.title, this.userId);
      } catch (error) {
        console.error('리뷰 제출 중 오류 발생:', error);
      }
    },

    async fetchReview(title, userId) {
      try {
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get(`/reviews/${encodedTitle}/${userId}`);
        this.myReview = response.data.myReview;
        this.otherReviews = response.data.otherReviews;
      } catch (error) {
        console.error('리뷰 불러오기 중 오류 발생', error);
      }
    },
    async removeReview(movieTitle, userId, comments) {
      try {
        const response = await axios.delete('/reviews/delete', {
          data: {
            movieTitle,
            userId,
            comments
          }
        });
        console.log(response.data.message);
        this.fetchReview(this.movie.title, this.userId);
      } catch (error) {
        console.error('리뷰 삭제 중 오류 발생:', error.response?.data?.message || error.message);
      }
    },
    editReview(review) {
      this.isEditMode = true;
      this.editingReview = review;
      this.reviewContent = review.comments;
      this.toggleForm();
    },
    resetForm() {
      this.isEditMode = false;
      this.editingReview = null;
      this.reviewContent = '';
    }
  },
  created() {
    this.fetchMovie(this.movieId);
  },
};
</script>

<style>
.movie-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.movie-container {
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: flex-start;
  width: 60%;
  margin-bottom: 50px;
}

.movie-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  flex: 1;
}

.movie-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.movie-list {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.movie-desc {
  font-size: 1rem;
  margin-bottom: 20px;
}

.movie-poster {
  max-width: 350px;
  height: auto;
}

.btn-small-group {
  display: flex;
  gap: 10px;
}

.form-overlay {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); 
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); 
  max-width: 600px; 
  width: 100%;
}

.form-container form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-label {
  color: black;
}

textarea {
  border: 1px solid #ced4da; 
  background-color: #ffffff; 
  color: #495057; 
}

.users-comment {
  width: 60%;
  padding: 30px;
  background-color: rgb(36, 35, 35);
}

.myreview {
  margin-bottom: 50px;
}

.author {
  font-weight: bold;
  font-size: 16px;
}

h5 {
  font-size: 20px;
}

.review {
  color: #a6a8ac;

}

.date {
  color: #a6a8ac;
  font-size: 15px;
}

.edit {
  margin-left: 12px;
}

.remove {
  margin-left: 10px;
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