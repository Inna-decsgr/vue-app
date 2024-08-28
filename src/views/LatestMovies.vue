<template>
  <div>
    <h3>최신 영화</h3>
    <MoviesList :movies="latestMovies"/>

    <MoviePagination 
      :total-pages="totalPages" 
      :current-page="currentPage" 
      @page-changed="handlePageChange" 
    />
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue'
import MoviePagination from '../components/MoviePagination.vue'
import { removeDuplicates } from '../utils/removeDuplicates.js'

export default {
  components: {
    MoviesList,
    MoviePagination
  },
  data() {
    return {
      latestMovies: [],
      currentPage: 1,
      totalPages: 1,
      totalMovies: 0,
      limit: 18
    };
  },
  mounted() {
    this.fetchLatestMovies();
  },
  methods: {
    async fetchLatestMovies(page = 1) {
      try {
        const response = await this.$http.get(`/movies/latest?page=${page}&limit=${this.limit}`);
        let movies = response.data;

        movies = removeDuplicates(movies, 'title');

        // 페이지네이션 로직
        const startIndex = (page - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        const paginatedMovies = movies.slice(startIndex, endIndex);

        this.latestMovies = paginatedMovies
        this.totalMovies = movies.length
        this.totalPages = Math.ceil(movies.length / this.limit);
        this.currentPage = page;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    },
    handlePageChange(page) {
      if (page < 1 || page > this.totalPages) return;
      this.fetchLatestMovies(page);
    }
  },
};
</script>