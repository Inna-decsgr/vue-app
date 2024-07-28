<template>
  <div>
    <h1>인기 영화</h1>
    <ul>
      <li v-for="movie in popularMovies" :key="movie._id">
        <h2>{{ movie.title }}</h2>
        <img :src="movie.poster_url" :alt="movie.title">
        <p>{{ movie.description }}</p>
        <p>Director: {{ movie.director }}</p>
        <p>Cast: {{ movie.cast.join(', ') }}</p>
        <p>Release Date: {{ movie.release_date }}</p>
        <p>Rating: {{ movie.rating }}</p>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
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