<template>
  <el-rate
    :value="value"
    disabled
    show-text
    show-score
    text-color="#ff9900"
    score-template="{value}分"
  />
</template>

<script>
  export default {
    props: ['value'],
  }
</script>
