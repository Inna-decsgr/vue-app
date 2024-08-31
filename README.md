# CinemaInsights

### 프로젝트 이름
cinemainsights

### 프로젝트 설명
'cinemainsights'는 다양한 영화 정보를 제공하는 Vue.js 기반의 웹 어플리케이션이다. 사용자는 실시간 인기 영화, 최신 영화, 장르별 영화 등을 검색하고, 영화에 대한 리뷰를 작성하거나 즐겨찾기에 추가할 수 있다. 또한, 사용자 맞춤형 영화 추천 기능도 제공된다. 이 어플리케이션은 Vue.js로 구성된 프론트엔드와 MongoDB를 기반으로 한 백엔드로 이루어져 있다.

### 프로젝트 목표
'cinemainsights'는 아래와 같은 목표를 가지고 개발되었다.
1. **포괄적인 영화 정보 제공** : 최신 영화, 인기 영화, 다양한 장르의 영화를 쉽게 검색하고 탐색할 수 있도록 한다.
2. **개인화된 사용자 경험** : 사용자 맞춤형 영화 추천 기능을 통해 개인의 취향에 맞는 영화를 추천한다.
3. **리뷰 및 즐겨찾기 기능** : 사용자가 영화에 대한 리뷰를 작성하고, 좋아하는 영화를 즐겨찾기에 추가하여 개인화된 영화 목록을 관리할 수 있게 한다.
4. **효율적인 상태 관리** : Vuex를 활용해서 사용자 인증 상태, 영화 데이터, 검색 결과 등의 상태를 효율적으로 관리한다.
5. **모던 웹 기술 활용** : 최신 웹 기술과 라이브러리(vue.js, firebase) 활용을 통해 사용자에게 매끄럽고 직관적인 인터페이스를 제공한다.

### 사용 기술
* **Vue.js** : 프론트엔드 UI 프레임워크
* **Vue Router** : SPA에서 페이지 간 네비게이션을 위한 라우팅 관리
* **Vuex** : 상태 관리를 위한 라이브러리
* **Axios** : HTTP 요청을 위한 라이브러리
* **Bootstrap** : UI 구성 요소와 스타일링
* **Node.js** : 서버 사이드에서 데이터 처리 및 API 제공
* **Firebase** : 구글 로그인 인증 및 사용자 관리를 위한 서비스

### 구현 사항
* **구글 로그인** : Firebase를 사용해서 구글 계정으로 로그인
* **홈 화면 (HomeView.vue)** : 인기 영화 목록을 페이지네이션으로 표시
* **최신 영화 (LatestMovies.vue)** : 최신 영화 목록을 페이지네이션으로 표시
* **장르별 영화 (GenreOverview.vue)** : 영화 장르를 리스트로 제공하며, 각 장르에 대한 상세 정보를 표시
* **영화 상세 정보 (MovieDetail.vue)** : 영화의 상세 정보를 제공하고, '보고싶어요', '즐겨찾기', '리뷰 작성' 기능을 통해 관심을 표시
* **마이 페이지 (MyPage.vue)** : 사용자가 찜한 영화, 즐겨찾기한 영화, 추천 영화 및 장르별 추천 영화를 표시
* **검색 (SearchMovies.vue)** : 영화 검색 기능 제공
 
### 주요 내용
**프론트엔드**
* **사용자 인터페이스**
  * **로그인** : 구글 계정이 있는 경우 Firebase의 `signInWithPopup`을 사용해서 구글로 로그인하고, 인증 상태를 확인한 후 로그인한다.
  * **로그아웃** : 로그아웃 버튼을 클릭하면 `logout` 함수가 실행되어 로그아웃된다.
* **상태 관리**
  * **Vuex 사용** : 사용자 정보, 액세스 토큰, 리프레쉬 토큰, 로딩 상태 등의 상태를 관리한다.
  * **로그인** : `loginWithGoogle`을 통해 /users 엔드포인트로 사용자 정보를 저장하거나 업데이트한다. 이때, /auth/login 엔드포인트를 호출해서 로그인 시 쿠키와 로컬 저장소에 JWT 토큰을 저장한다.
  * **토큰 갱신** : `refreshToken`을 통해 /auth/refresh 요청을 보내고, 서버에서 받은 새로운 accessToken과 refreshToken으로 업데이트한다.
  * **로그아웃** : `logout` 함수를 통해 /auth/logout 요청을 보내고, 쿠키와 로컬 저장소에 저장된 토큰을 삭제한다.
  * **상태 유지** : `createPersistedState` 플러그인을 사용해서 Vuex 스토어의 user와 token 상태를 유지한다.
 
    
### 문제 해결
영화 리뷰 어플리케이션을 구현하면서 발생한 문제들과 이를 해결하기 위해 한 방법들을 기술해보려고 한다.
* **🟥문제 1: JWT 토큰 관리 문제**
  
🫁 **문제 내용**: 로그인 시 JWT가 정상적으로 반환되었으나, 로그아웃 후에도 이전 토큰이 남아 있어 인증 문제가 발생했다. 또한, 페이지 새로고침 시 인증 상태가 제대로 유지되지 않는 문제가 있었다.  

🫁 **해결 방법**:  
(1) **클라이언트 측 확인**: 쿠키에 JWT 토큰이 제대로 저장되는지 확인하기 위해 Axios 요청에 withCredentials: true를 설정하여 쿠키를 포함시켰다.
```js
 const response = await axios.post('http://localhost:5000/api/auth/login', {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
}, { withCredentials: true });
```

(2) **로그아웃 시 토큰 처리**: 로그아웃 시 /api/auth/logout 엔드포인트를 호출하여 서버에서 쿠키의 JWT를 삭제하고, 클라이언트 측에서도 로컬 저장소와 Axios 헤더에서 토큰을 삭제한다. 이렇게 함으로써 로그아웃 후에도 인증 정보가 남아 있지 않도록 한다.
```js
async logout() {
  try {
    await axios.post('http://localhost:5000/api/auth/logout');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    this.isLoggedIn = false;
    this.$router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
```

(3) **상태 유지**: 페이지 새로 고침 시 로그인 상태를 유지하기 위해 `mounted` 훅에서 로컬 저장소에서 토큰을 확인하고, 토큰이 존재하는 경우에만 인증 상태를 확인하도록 수정한다. 이렇게 하면 사용자가 페이지를 새로 고침할 때도 인증 상태가 유지된다.
```js
async mounted() {
  // 로컬 저장소에서 토큰 확인
  const token = localStorage.getItem('token');

  // 토큰이 있을 때만 인증 상태 확인
  if (token) {
    await this.checkAuthStatus();
  }
}
```
🫁 **결론** : 이와 같은 방식으로 문제를 해결함으로써, 로그인 및 로그아웃 기능이 원활하게 작동하며, 페이지 새로 고침 후에도 사용자 인증 상태가 유지된다.  
**블로그 참고** : https://velog.io/@kimina/%EC%98%81%ED%99%94-%EB%A6%AC%EB%B7%B0-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%984-JWT%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%83%81%ED%83%9C-%EC%9C%A0%EC%A7%80-%EB%B0%8F-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-%EA%B3%BC%EC%A0%95

**🟥문제 2: Vuex 상태가 새로 고침 후 초기화됨**  

🫁 **문제 내용**: `Cannot read properties of undefined (reading 'post')` 에러는 this.$http 대신 axios를 사용하여 해결했으나, 페이지 새로 고침 후 Vuex의 user 상태가 사라지는 문제가 발생했다. 로컬 스토리지에는 token과 user 모두 저장되고 있었지만, 새로 고침 후 user만 'undefined'로 나타났다.  

🫁 **해결 방법**:  
(1) **axios로 수정**: Vuex 액션에서 `this.$http` 대신 `axios`를 사용하여 로그인 요청을 수정하였다.
```js
// 기존 코드
// const response = await this.$http.post('http://localhost:5000/api/auth/login', { ... });

// 수정 코드
const response = await axios.post('http://localhost:5000/api/auth/login', { ... });
```
(2) **Vuex 상태 복원**: `vuex-persistedstate` 라이브러리를 사용하여 Vuex 상태를 로컬 스토리지에 자동으로 저장하고 복원하도록 설정하였다. 이를 통해 상태를 별도로 저장할 필요가 없어진다.
```js
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  // ...
  plugins: [createPersistedState({
    paths: ['token', 'user']  // 저장할 상태를 지정
  })]
});
```
(3) **상태 복원 코드 추가**: 컴포넌트가 마운트될 때 로컬 스토리지에서 token과 user를 가져와 Vuex 상태를 업데이트하도록 수정하였다.
```js
async mounted() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user'); 

  if (token) {
    this.$store.commit('setToken', token);
  }
  if (user) {
    this.$store.commit('setUser', JSON.parse(user));
  }

  if (token) {
    await this.checkAuthStatus();
  }
}
```
🫁 **결론**: mounted 훅에서 로컬 스토리지의 상태를 Vuex 상태로 업데이트하니 페이지 새로 고침 후에도 사용자 정보를 정상적으로 유지할 수 있었다. 이 문제는 새로 고침 시 Vuex 상태가 초기화되면서 발생했던 것으로, mounted 훅에서 상태를 복원하도록 함으로써 해결되었다. 코드가 복잡해지면서 놓친 부분이 있었으나, 해결된 후에는 모든 기능이 정상적으로 작동하였다.  
**블로그 참고** : https://velog.io/@kimina/%EC%98%81%ED%99%94-%EB%A6%AC%EB%B7%B0-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%986-Vuex%EB%A1%9C-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC-%EB%B0%8F-%EC%83%81%ED%83%9C-%EC%9C%A0%EC%A7%80%ED%95%98%EA%B8%B0


**🟥문제 3: URL 인코딩 문제로 인한 404 오류 발생**  

🫁 **문제 내용**: 클라이언트에서 movie.title을 URL에 직접 포함시킬 때, 공백이나 특수 문자가 제대로 인코딩되지 않아 서버에서 URL을 찾을 수 없다는 404 오류가 발생했다. 이로 인해 서버는 요청을 제대로 처리하지 못했다.  

🫁 **해결 방법**:   
1. **클라이언트 측 인코딩 처리**: URL에 포함되는 문자열을 안전하게 인코딩하기 위해 `encodeURIComponent` 함수를 사용했다. 이 함수는 URL에서 문제가 될 수 있는 문자를 적절히 변환하여 URL이 깨지지 않도록 해준다.
```js
async fetchReview(title, userId) {
  try {
    const encodedTitle = encodeURIComponent(title);  // 제목을 인코딩
    const response = await axios.get(`/reviews/${encodedTitle}/${userId}`);
    this.myReview = response.data.myReview;
    this.otherReviews = response.data.otherReviews;
  } catch (error) {
    console.error('리뷰 불러오기 중 오류 발생', error);
  }
}
```
2. **서버 측 디코딩 처리**: 서버에서 클라이언트로부터 받은 인코딩된 URL을 디코딩하여 데이터베이스 쿼리와 비교한다. 이를 통해 클라이언트에서 인코딩된 URL을 올바르게 처리할 수 있다.
```js
router.get('/:title/:userId', async (req, res) => {
  const { title, userId } = req.params;
  const decodedTitle = decodeURIComponent(title);  // 제목을 디코딩

  try {
    // 영화 모델을 사용하여 title로 영화 찾기
    const movie = await PopularMovie.findOne({ title: decodedTitle }) || 
                  await LatestMovie.findOne({ title: decodedTitle }) || 
                  await GenreMovie.findOne({ title: decodedTitle });

    if (!movie) {
      return res.status(404).json({ message: '영화를 찾을 수 없습니다.' });
    }

    const myReview = movie.comments.filter(comment => comment.userId.toString() === userId);
    const otherReviews = movie.comments.filter(comment => comment.userId.toString() !== userId);

    res.status(200).json({ myReview, otherReviews });
  } catch (error) {
    console.error('리뷰 가져오기 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

```
🫁 **결론** : `encodeURIComponent`를 사용하여 URL에 포함되는 문자열을 인코딩하고, 서버에서 `decodeURIComponent`를 사용하여 디코딩함으로써, 특수 문자와 공백이 포함된 URL을 안전하게 처리할 수 있었다. 이로 인해 404 오류가 해결되었고, 서버와 클라이언트 간의 통신이 원활하게 이루어졌다.  
**블로그 참고** : https://velog.io/@kimina/%EC%98%81%ED%99%94-%EB%A6%AC%EB%B7%B0-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%9811-%EC%98%81%ED%99%94-%EB%A6%AC%EB%B7%B0-%EC%BD%94%EB%A9%98%ED%8A%B8-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84


### 사용 방법
🥲 **개발 서버 실행**
* 개발 서버를 실행해서 로컬에서 어플리케이션을 확인할 수 있다.
  ```
    npm run serve
  ```
🥲 **백엔드 실행**
* 백엔드 서버를 실행해서 데이터를 불러오고 API를 제공할 수 있다.
  1. **필수 의존성 설치:**
     * 먼저, 백엔드 디렉토리로 이동한 후 필요한 의존성을 설치한다.
       ```
         cd backend
         npm install
       ```
  2. **백엔드 서버 실행:**
     * 서버를 시작해서 API를 사용할 수 있다.
       ```
         node app.js
       ```
  3. **데이터베이스 설정:**
     * MongoDB 데이터베이스가 필요하다. `backend/config/config.js` 파일에서 데이터베이스 URI를 설정한다.
