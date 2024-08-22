<template>
  <Splide
    v-if="movies.length"
    :options="{
      perPage: 7,
      gap: '1rem',
      breakpoints: {
        800: { perPage: 2 },
        600: { perPage: 1 },
      },
      drag: 'free',
      pagination: false,
      arrows: true,
    }"
    aria-label="Movie Carousel"
  >
    <SplideSlide v-for="movie in movies" :key="movie.movieId">
      <img 
        :src="movie.imageUrl || movie.poster_url || movie._doc?.poster_url" 
        :alt="movie.title || movie._doc.title" 
        class="movie-image"
        @click="moveDetail(movie.movieId)"
      />
    </SplideSlide>
  </Splide>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';
export default {
  components: { Splide, SplideSlide },
  props: {
    movies: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number
    },
  },
  methods: {
    moveDetail(movieId) {
      this.$router.push(`/movies/${movieId}`);
      console.log(this.movies)
    }
  }
};
</script>

<style scoped>
.movie-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
