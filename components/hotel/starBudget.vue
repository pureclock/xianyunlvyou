<template>
  <span :title="value + '星级'">
    <i v-for="i in value" class="iconfont iconhuangguan" />
  </span>
</template>

<script>
  export default {
    props: ['value'],
  }
</script>
