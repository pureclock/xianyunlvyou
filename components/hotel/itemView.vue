<template>
  <el-row class="hotel-item" :gutter="20">
    <el-col :span="8">
      <span class="img-wrapper">
        <nuxt-link :to="'/hotel/' + dataSource.id + '.html'">
          <img :src="dataSource.photos" :alt="dataSource.name" width="320" height="210">
        </nuxt-link>
      </span>
    </el-col>

    <el-col :span="10">
      <!-- 名称信息 -->
      <h4 class="hotel-cn-name">
        <nuxt-link :to="'/hotel/' + dataSource.id + '.html'">
          {{dataSource.name}}
        </nuxt-link>
      </h4>
      <div class="hotel-en-name">
        <span>{{dataSource.alias}} </span>
        <starBudget :value="hotellevel" />
        <span v-if="dataSource.hoteltype">{{dataSource.hoteltype.name}}</span>
      </div>

      <!-- 评价信息 -->
      <el-row type="flex" :gutter="10">
        <el-col :span="10">
          <rateBudget :value="dataSource.stars" class="rate-budget" />
        </el-col>
        <el-col :span="7">
          <span class="height-light">{{comments}}</span> 条评价
        </el-col>
        <el-col :span="7">
          <span class="height-light">{{dialog}}</span> 篇游记
        </el-col>
      </el-row>

      <!-- 简介 -->
      <div class="hotel-summary-row">{{dataSource.summary}}</div>

      <div class="location-row"><iconFont class="iconlocation"/>位于: {{dataSource.address}}</div>
    </el-col>

    <el-col :span="6" class="price-col">
      <el-table
        :data="dataSource.products"
        style="width: 100%"
        class="price-table"
        :show-header="false"
        row-class-name="product-row"
        @row-click="handleProductClick"
      >
        <el-table-column prop="name" />
        <el-table-column>
          <template slot-scope="scope">
            <span class="height-light larger">￥{{scope.row.price}}</span>起
            <i class="el-icon-arrow-right"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
  import nuxtConfig from '@/nuxt.config'
  import iconFont from '@/components/common/iconFont'
  import rateBudget from './rateBudget'
  import starBudget from './starBudget'

  export default {
    props: ['dataSource'],
    components: {
      iconFont,
      rateBudget,
      starBudget,
    },

    computed: {
      comments: () => Math.floor(Math.random() * 100) + 1,
      dialog: () => Math.floor(Math.random() * 100) + 1,
      hotellevel: function () {
        const { level } = this.dataSource.hotellevel || {}
        return level
      },
    },

    methods: {
      handleProductClick(e) {
        window.open('https://hotels.ctrip.com/hotel/694679.html', '_blank')
      }
    }
  }
</script>

<style scoped lang="less">
  .hotel-item {
    padding: 25px 0;
    border-bottom: 1px solid #eee;
  }
  .larger {
    font-size: larger;
  }

  .x-large {
    font-size: x-large;
  }
  .height-light {
    color: #f90;
  }
  .hotel-cn-name {
    font-weight: normal;
    font-size: x-large;
  }
  .hotel-en-name {
    margin-bottom: 0.5em;
  }

  .rate-budget {
    display: inline-block;
  }

  .hotel-summary-row {
    margin: 1em 0;
    font-size: 14px;
    color: #666;
  }

  .location-row {
    color: #666;
    font-size: 14px;
  }

  .img-wrapper {
    width: 420px;
    > img {
      border-radius: 4px;
    }
  }
  .hotel-en-name {
    color: #999;
  }
  .price-col {
    margin-top: 20px;
    .price-num {
      font-size: x-large;
    }
    /deep/ .product-row {
      cursor: pointer;
    }
  }
</style>
