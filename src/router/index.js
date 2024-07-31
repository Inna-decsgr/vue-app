import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LatestMovies from '../views/LatestMovies.vue';
import GenreMovies from '../views/GenreMovies.vue';
import GenreOverview from '../views/GenreOverview.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/latest',
    name: 'LatestMovies',
    component: LatestMovies
  },
  {
    path: '/genre',
    component: GenreOverview, // 기본 페이지
    redirect: '/genre/action', // 기본 리다이렉트
    children: [
      { path: ':genreName', name: 'GenreMovies', component: GenreMovies }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
