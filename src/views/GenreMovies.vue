<template>
  <div>
    <h1>{{ genreName }} 영화</h1>
    <MoviesList :movies="movies" />
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue';
import axios from 'axios';
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

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
  10752: 'War',
};

export default {
  name: 'GenreMovies',
  components: {
    MoviesList
  },
  setup() {
    const route = useRoute();
    const genreName = computed(() => route.params.genreName);

    const genreId = ref(null);
    const movies = ref([]);

    const updateGenreId = () => {
      const id = Object.keys(genreMap).find(key => genreMap[key].toLowerCase() === genreName.value.toLowerCase());
      genreId.value = id ? parseInt(id) : null;
      console.log('Updated genreId:', genreId.value); // Log for debugging
    };

    const fetchMovies = async () => {
      if (genreId.value) {
        console.log('Fetching movies for genreId:', genreId.value); // Log for debugging
        try {
          const response = await axios.get(`/movies/genre/${genreId.value}`);
          movies.value = response.data;
          console.log('Movies fetched:', response.data); // Log for debugging
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      }
    };

    watch(genreName, (newValue) => {
      console.log('Genre name changed:', newValue); // Log for debugging
      updateGenreId();
      fetchMovies();
    }, { immediate: true });

    onMounted(() => {
      updateGenreId();
      fetchMovies();
    });

    return {
      genreName,
      movies
    };
  },
};
</script>
