<template>
  <el-row class="photo-view">
    <el-col :span="16" class="main-pic">
      <img height="360" width="640" :src="currentPhoto.value" :alt="currentPhoto.name">
      <span class="summary">{{summary}}</span>
    </el-col>
    <el-col :span="8" class="list-pics">
      <el-row :gutter="20" class="list-item">
        <el-col v-for="(p, i) in dataSource" :span="12" :key="p.value" >
          <a href="javascript:void(0)" @click="() => handleClick(i)">
            <img width="160" :src="p.value" :alt="p.name">
          </a>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: ['dataSource', 'summary'],
    data() {
      return {
        current: 0,
      }
    },

    computed: {
      currentPhoto() {
        return this.dataSource[this.current]
      }
    },

    methods: {
      handleClick(i) {
        this.current = i
      }
    }
  }
</script>

<style scoped scoped="less">
  .photo-view {
    img {
      display: inline-block;
      border-radius: 6px;
    }
  }

  .main-pic {
    position: relative;
    .summary {
      position: absolute;
      width: 240px;
      bottom: 20px;
      left: 20px;

      background: rgba(0,0,0,0.5);
      color: #fff;
      padding: 20px;
    }
  }

  .list-pics img {
    margin-bottom: 10px;
  }

</style>
