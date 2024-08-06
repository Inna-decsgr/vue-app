<template>
  <div>
    <h3>{{ genreName }} 영화</h3>
    <MoviesList :movies="movies" />
  </div>
</template>



<script>
import MoviesList from '../components/MoviesList.vue'
import axios from 'axios';

const genreMap = {
    28: 'action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    53: 'Thriller',
    10752: 'War',
};

export default {
  name: 'ActionMovies',
  components: {
    MoviesList
  },
  props: {
    genreName: String
  },
  data() {
    return {
      movies: [],
      genreId: Object.keys(genreMap).find(key => genreMap[key] === this.genreName)
    };
  },
  async created() {
    console.log('장르이름:', this.genreName); // 확인용 로그
    console.log('장르아이디:', this.genreId);

    if (this.genreId) {
      try {
        const response = await axios.get(`/movies/genre/${this.genreId}`);
        this.movies = response.data;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }
  }
};
</script>
