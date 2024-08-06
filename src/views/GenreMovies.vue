<template>
  <div>
    <h3>{{ genreName }}</h3>
    <MoviesList :movies="movies" />
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue';
import axios from 'axios';
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const genreMap = {
  28: '액션',
  12: '어드벤처',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  10402: '음악',
  10749: '로맨스',
  10752: '전쟁',
};

export default {
  name: 'GenreMovies',
  components: {
    MoviesList
  },
  setup() {
    const route = useRoute();
    const genreId = ref(null);
    const movies = ref([]);
    const genreName = computed(() => route.params.genreName);

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
