<template>
  <div>
    <h3>{{ genreName }}</h3>
    <MoviesList :movies="movies" />

    <MoviePagination 
      :total-pages="totalPages" 
      :current-page="currentPage" 
      @page-changed="handlePageChange" 
    />
  </div>
</template>

<script>
import MoviesList from '../components/MoviesList.vue';
import MoviePagination from '../components/MoviePagination.vue';
import axios from 'axios';
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { removeDuplicates } from '../utils/removeDuplicates.js'

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
    MoviesList,
    MoviePagination
  },
  setup() {
    const route = useRoute();
    const genreId = ref(null);
    const movies = ref([]);  // 영화 목록을 저장
    const genreName = computed(() => route.params.genreName);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalMovies = ref(0);
    const limit = ref(18);

    const updateGenreId = () => {
      const id = Object.keys(genreMap).find(key => genreMap[key].toLowerCase() === genreName.value.toLowerCase());
      genreId.value = id ? parseInt(id) : null;
    };

    const fetchMovies = async (page = 1) => {
      if (genreId.value) {
        try {
          const response = await axios.get(`/movies/genre/${genreId.value}`);
          const allMovies = removeDuplicates(response.data, 'title');

          // 페이지네이션 로직
          const startIndex = (page - 1) * limit.value;
          const endIndex = startIndex + limit.value;
          movies.value = allMovies.slice(startIndex, endIndex);

          totalMovies.value = allMovies.length;
          totalPages.value = Math.ceil(allMovies.length / limit.value);
          currentPage.value = page;
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      } else {
        movies.value = [];
        totalMovies.value = 0;
        totalPages.value = 1;
        currentPage.value = 1;
      }
    };

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      fetchMovies(page);
    };

    watch(genreName, () => {
      updateGenreId();
      fetchMovies();
    }, { immediate: true });

    onMounted(() => {
      updateGenreId();
      fetchMovies();
    });

    return {
      genreName,
      movies,
      currentPage,
      totalPages,
      handlePageChange
    };
  },
};
</script>
