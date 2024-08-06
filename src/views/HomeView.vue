<template>
  <div>
    <h3 class="mb-5 fw-bold">실시간 인기 영화</h3>
    <MoviesList :movies="popularMovies"/>

    <MoviePagination 
      :total-pages="totalPages" 
      :current-page="currentPage" 
      @page-changed="handlePageChange" 
    />
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue';
import { removeDuplicates } from '../utils/removeDuplicates';
import MoviePagination from '@/components/MoviePagination.vue';

export default {
  components: {
    MoviesList,
    MoviePagination
  },
  data() {
    return {
      popularMovies: [], // 빈 배열로 초기화
      currentPage: 1,
      totalPages: 1,
      totalMovies: 0,
      limit: 18
    };
  },
  mounted() {
    this.fetchPopularMovies();
  },
  methods: {
    async fetchPopularMovies(page = 1) {
      try {
        const response = await this.$http.get(`/movies/popular?page=${page}&limit=${this.limit}`);
        let movies = response.data;

        // 중복 제거
        movies = removeDuplicates(movies, 'title');


        // 페이지네이션 로직
        const startIndex = (page - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const paginatedMovies = movies.slice(startIndex, endIndex);

        this.popularMovies = paginatedMovies
        this.totalMovies = movies.length
        this.totalPages = Math.ceil(movies.length / this.limit);
        this.currentPage = page;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    },
    handlePageChange(page) {
      if (page < 1 || page > this.totalPages) return;
      this.fetchPopularMovies(page);
    }
  }
};
</script>

