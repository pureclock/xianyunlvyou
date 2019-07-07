<!-- (星级)均价模块 -->

<template>
  <el-tooltip placement="bottom-start" :visible-arrow="false" content="等级评定是针对房价，设施和服务等各方面水平的综合评估。">
    <span>
      <i class="iconfont iconhuangguan" v-for="i in starLevel"></i>
      <span class="price-budget">¥{{price}}</span>
    </span>
  </el-tooltip>
</template>

<script>
  export default {
    props: ['starLevel', 'price']
  }
</script>

<style>
  .iconhuangguan {
    color: #f90;
  }

  .price-budget {
    margin-left: 0.5em;
  }
</style>
