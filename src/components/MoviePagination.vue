<template>
  <nav v-if="totalPages > 1" class="pagination-container">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
      </li>
      <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-changed', page);
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  position: fixed;
  bottom: 20px; /* 화면 하단에서의 거리 조정 */
  left: 50%; /* 화면 중앙에서의 거리 조정 */
  transform: translateX(-50%); /* 중앙 정렬을 위한 수평 이동 */
  z-index: 1000; /* 다른 요소들 위에 표시되도록 설정 */
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: white;  /* 글자 색상 */
  font-weight: bold;
  background-color: rgb(54, 52, 52);
  border-radius: 15px;
}

.page-item.disabled .page-link {
  color: #6c757d;
  cursor: not-allowed;
}

.page-item.active .page-link {
  background-color: white;
  color: black;
}
</style>
