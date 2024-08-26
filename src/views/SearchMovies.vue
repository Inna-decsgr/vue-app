<template>
  <div>
    <SearchBar @search="handleSearch" />
    <div v-if="hasSearched">
      <div v-if="results && results.length > 0">
        <h2>"{{ query }}"(으)로 검색한 결과</h2>
        <MoviesList :movies="results" />
      </div>
      <div v-else>
        <p>"{{ query }}"와 일치하는 영화가 없습니다.</p>
      </div>
    </div>
    <div v-else>
      <p>원하는 영화를 찾아보세요.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchBar from '@/components/SearchBar.vue';
import MoviesList from '../components/MoviesList.vue';

export default {
  components: {
    SearchBar,
    MoviesList
  },
  data() {
    return {
      results: [],
      hasSearched: false,
      query: ''
    };
  },
  methods: {
    async handleSearch(query) {
        this.query = query;
      this.hasSearched = true;
        
        if (query) {
          try {
            console.log('Searching for', this.query);
            const encodedQuery = encodeURIComponent(query);
            const response = await axios.get(`movies/search?q=${encodedQuery}`);
            const movies = response.data.movies || [];

              // 중복 제거
            this.results = this.removeDuplicates(movies);
            console.log('Search results:', this.results);
          } catch (error) {
            console.error('검색 중 오류 발생:', error);
            this.results = [];  // 오류 발생 시 빈 배열로 초기화
          }
        } else {
        this.results = [];  // 빈 문자열일 때 빈 배열로 초기화
      }
    },

    // 중복 제거 메서드
    removeDuplicates(movies) {
      const movieTitles = new Set();
      return movies.filter(movie => {
        const isDuplicate = movieTitles.has(movie.title);
        console.log(isDuplicate);
        movieTitles.add(movie.title);
        return !isDuplicate;
      });
    }
	}
};
</script>
