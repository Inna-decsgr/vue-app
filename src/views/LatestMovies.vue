<template>
  <div>
    <h1>최신 영화</h1>
    <MoviesList :movies="latestMovies"/>
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
      latestMovies: [],
    };
  },
  mounted() {
    this.fetchPopularMovies();
  },
  methods: {
    async fetchPopularMovies() {
      try {
        const response = await this.$http.get('http://localhost:5000/api/movies/latest');
        this.latestMovies = response.data;
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    },
  },
};
</script>