<template>
  <div>
    <input type="text" v-model="query" @input="onChange" placeholder="검색어를 입력하세요" />
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

