<template>
  <div>
    <h1>인기 영화</h1>
    <MoviesList :movies="popularMovies"/>
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue'

export default {
  components: {
    MoviesList
  },
  data() {
    return {
      popularMovies: [],
    };
  },
  mounted() {
    this.fetchPopularMovies();
  },
  methods: {
    async fetchPopularMovies() {
      try {
        const response = await this.$http.get('http://localhost:5000/api/movies/popular');
        this.popularMovies = response.data;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    },
  },
};
</script>