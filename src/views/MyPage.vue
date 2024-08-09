<template>
  <div>
    <h2>내가 찜한 영화</h2>
    <div v-if="loading">로딩 중...</div>
    <div v-else>
      <VueperSlides
        v-if="likedMovies.length"
        class="no-shadow"
        :visible-slides="3"
        slide-multiple
        :gap="3"
        :slide-ratio="1 / 4"
        :dragging-distance="200"
        :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }"
      >
        <VueperSlide v-for="movie in likedMovies" :key="movie.movieId">
          <img :src="movie.imageUrl" :alt="movie.title" width="100%" />
        </VueperSlide>
      </VueperSlides>
      <p v-else>찜한 영화가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      likedMovies: [],
      loading: true,
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
        const response = await axios.get(`/likes/${this.userId}`);
        this.likedMovies = response.data;
        console.log(this.likedMovies); // 데이터 확인
      } catch (error) {
        console.error('찜한 영화 목록을 가져오는 중 오류 발생:', error);
      } finally {
        this.loading = false;
      }
    } else {
      console.error('사용자 ID가 없습니다.');
      this.loading = false;
    }
  },
};
</script>
