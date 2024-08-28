import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LatestMovies from '../views/LatestMovies.vue';
import GenreMovies from '../views/GenreMovies.vue';
import GenreOverview from '../views/GenreOverview.vue';
import SearchMovies from '../views/SearchMovies.vue';
import MyPage from '../views/MyPage.vue';
import MovieDetail from '../views/MovieDetail.vue';


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
    component: GenreOverview, 
    redirect: '/genre/액션', 
    children: [
      { path: ':genreName', name: 'GenreMovies', component: GenreMovies }
    ]
  },
  {
    path: '/search',
    name: 'SearchMovies',
    component: SearchMovies
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: MyPage
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: MovieDetail
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
