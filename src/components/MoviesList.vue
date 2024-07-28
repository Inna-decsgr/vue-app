<template>
  <div>
    <ul>
      <li v-for="movie in movies" :key="movie._id">
        <h2>{{ movie.title }}</h2>
        <img :src="movie.poster_url" :alt="movie.title" />
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
  props: {
    movies: {
      type: Array,
      required: true
    }
  }
}
</script>