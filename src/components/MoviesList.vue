<template>
  <div class="container mt-5">
    <div class="row">
      <div v-for="movie in movies" :key="movie._id" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-5">
        <div class="card h-100 movie-card" @click="moveDetail(movie._id)">
          <img :src="movie.poster_url" :alt="movie.title" class="card-img-top" />
          <div class="card-body">
            <h3 class="fw-bold fs-4">{{ movie.title }}</h3>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><span class="fw-bold">감독: </span>{{ movie.director }}</li>
            <li class="list-group-item"><span class="fw-bold">출연진:</span> {{ movie.cast.join(', ') }}</li>
            <li class="list-group-item"><span class="fw-bold">개봉 날짜:</span> {{ movie.release_date }}</li>
            <li class="list-group-item"><span class="fw-bold">평점:</span> {{ movie.rating }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movies: {
      type: Array,
      required: true
    }
  },
  methods: {
    moveDetail(movieId) {
      this.$router.push(`/movies/${movieId}`)
    }
  }
}
</script>

<style>
.container {
  max-width: 100%;
}

.card-img-top {
  width: 100%; 
  height: 500px; 
  object-fit: cover; 
}

.card-body {
  padding: 15px;
  flex: 0 0;
}

.movie-card {
  cursor: pointer;
}

.movie-card:hover {
  box-shadow: inset;
}


</style>