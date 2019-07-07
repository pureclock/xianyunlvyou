<template>
  <div class="circle-rate">
    <svg :viewBox="viewBox">
      <path
        :d="d"
        fill="none"
        :stroke="stroke"
        :stroke-width="strokeWidth"
      />
    </svg>
    <span class="text" :style="{color: stroke}">
      <span v-if="label">{{label}}</span>
      <span class="value">{{value}}</span>
    </span>
  </div>
</template>
<script>
  export default {
    props: {
      label: String,
      value: Number,
      radius: {type: Number, default: 80},
      stroke: {type: String, default: '#f90'},
      strokeWidth: {type: Number, default: 2},
    },

    computed: {
      viewBox() {
        const w = (this.radius + this.strokeWidth) * 2
        return `0 0 ${w} ${w}`
      },

      d() {
        const {radius, strokeWidth} = this
        const r = radius - strokeWidth
        const value = Math.min(9.9999, this.value)
        const angle = (value / 10) * 2 * Math.PI - (Math.PI / 2)

        const l = value > 5 ? 1 : 0
        const x = radius + r * Math.cos(angle)
        const y = radius + r * Math.sin(angle)

        return `M ${radius} ${strokeWidth}, A ${radius},${radius} 0 ${l} 1 ${x},${y}`
      }
    }
  }
</script>

<style scoped="less">
  .circle-rate {
    position: relative;
  }
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
  }
</style>
