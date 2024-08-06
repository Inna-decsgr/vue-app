<template>
  <div class="container mt-5">
    <div class="row">
      <div v-for="movie in movies" :key="movie._id" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-5">
        <div class="card h-100" @click="moveDetail(movie._id)">
          <img :src="movie.poster_url" :alt="movie.title" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title fw-bold">{{ movie.title }}</h5>
            <p class="card-text description">{{ movie.description }}</p>
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
  cursor:pointer
}

.card-img-top {
  width: 100%; 
  height: 500px; 
  object-fit: cover; 
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3em;
}
</style>