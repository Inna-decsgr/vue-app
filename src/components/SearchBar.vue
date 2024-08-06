<template>
  <div class="mb-5 d-flex align-items-center">
    <input class="form-control form-control-md" type="text" v-model="query" @change="onChange" placeholder="검색어를 입력하세요" style="width:600px" />
    <button class="btn btn-primary searchbar" @click="onChange">
      검색
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    onChange() {
      if (this.query.trim()) { // 검색어가 비어 있지 않은 경우에만 검색 이벤트를 발생
        this.$emit('search', this.query);
      } else {
        // 검색어가 비어 있는 경우, 검색 이벤트를 발생시키지 않음
        this.$emit('search', null);
      }
    }
  }
};
</script>

<style>
.form-control-md {
  height: 2.5rem;
  border-radius: 5px 0px 0px 5px;
}
.btn-primary.searchbar {
  height: 2.5rem; 
  padding: 0 1rem;
  font-size: 1rem;
  border-radius: 0 5px 5px 0; 
  width: 70px;
}

@media (max-width: 767px) {
  .btn-primary.searchbar {
    width: 90px;
  }
}

</style>