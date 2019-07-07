<template>
  <section class="container">
    <div v-if="loaded">
      <!-- 面包屑导航条 -->
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/hotel' }">酒店</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/hotel' }">{{hotel.real_city}}酒店</el-breadcrumb-item>
          <el-breadcrumb-item>{{hotel.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 名称信息 -->
      <el-row class="name-info">
        <el-col>
          <el-row>
            <h4 class="hotel-cn-name">
            {{hotel.name}}
            <starBudget :value="hotel.hotellevel" />
          </h4>
          </el-row>
          <el-row>
            <span class="hotel-en-name">{{hotel.alias}}</span>
          </el-row>
          <el-row><i class="iconfont iconlocation" />{{hotel.address}}</el-row>
        </el-col>
      </el-row>

      <!-- 图片信息 -->
      <el-row class="pic-info info-row">
        <photoView :dataSource="photoList" summary="" />
      </el-row>

      <!-- 价格信息 -->
      <el-table
        :data="hotel.products"
        style="width: 100%"
        class="info-row"
        @row-click="onPriceRowClick"
        :row-style="{cursor: 'pointer'}"
      >
        <el-table-column prop="name" label="价格来源"/>
        <el-table-column label="低价房型" prop="bestType" />
        <el-table-column label="最低价格/每晚" width="160">
          <template slot-scope="scope">
            <span class="height-light larger">
              ￥{{scope.row.price}}
            </span>起
            <span>
              <i class="el-icon-arrow-right height-light" />
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div class="info-row">
        <detailMap :dataSource="hotel" width="600px" height="400px"/>
      </div>

      <div class="info-row">
        <el-row class="assets-info">
          <el-col :span="4" class="assets-info-hd">基本信息</el-col>
          <el-col :span="20" class="assets-info-bd">
            <el-row type="flex" :gutter="10" class="base-info">
              <el-col>入住时间: 14:00之后</el-col>
              <el-col>离店时间: 12:00之前</el-col>
              <el-col>{{hotel.creation_time}} / {{hotel.renovat_time}}</el-col>
              <el-col>酒店规模: {{hotel.roomCount}}间客房</el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="assets-info">
          <el-col :span="4" class="assets-info-hd">主要设施</el-col>
          <el-col :span="20" class="assets-info-bd">
            <span v-for="a in hotel.hotelassets" :key="a.name" type="info" class="assets-info-item">{{a.name}}</span>
          </el-col>
        </el-row>

        <el-row class="assets-info">
          <el-col :span="4" class="assets-info-hd">停车服务</el-col>
          <el-col :span="20" class="assets-info-bd base-info">
            {{hotel.parking || '-'}}
          </el-col>
        </el-row>

        <el-row class="assets-info">
          <el-col :span="4" class="assets-info-hd">品牌信息</el-col>
          <el-col :span="20" class="assets-info-bd">
            {{hotel.hotelbrand ? hotel.hotelbrand.name : '-'}}
          </el-col>
        </el-row>
      </div>

      <div class="comment-row">
        <h4 class="comments-hd">{{ comments.total }}条真实用户评论</h4>

        <el-row type="flex" class="scores-row">
          <el-col :span="4">
            <p>总评数：{{hotel.all_remarks}}</p>
            <p>好评数：{{hotel.good_remarks}}</p>
            <p>差评数：{{hotel.bad_remarks}}</p>
          </el-col>
          <el-col class="recomment-score" :span="5">
            <div class="comment-star"><rateBudget :value="hotel.stars" /></div>
            <div class="x-large height-light stamp">{{recomment}}</div>
          </el-col>
          <el-col v-for="s in scores" :span="3" :key="s.value">
            <div class="rate-box">
              <circleRate :radius="35" :value="s.value" :label="s.name" />
            </div>
          </el-col>
        </el-row>

        <div class="comment-list">
          <commentsView :userInfo="userInfo" :hotel="hotel" :dataSource="comments.data" />
        </div>
      </div>

    </div>

    <div v-else class="empty-page">
      <img src="/images/loading.gif" alt="">
    </div>
  </section>
</template>

<script>
  import photoView from '@/components/hotel/detail/photos'
  import detailMap from '@/components/hotel/detail/map'
  import starBudget from '@/components/hotel/starBudget'
  import rateBudget from '@/components/hotel/rateBudget'
  import circleRate from '@/components/hotel/circleRate'
  import commentsView from '@/components/hotel/detail/comments'
  import nuxtConfig from '@/nuxt.config'

  export default {
    data() {
      return {
        loaded: false,
        userInfo: null,
        hotel: {},
        comments: {},
        baseURL: nuxtConfig.axios.baseURL
      }
    },

    mounted() {
      const { params: {id} } = this.$route
      // 登录并获取用户信息
      this.$axios({
        url: '/accounts/login',
        method: 'post',
        data: {
          username: '13312882474',
          password: '123123',
        }
      }).then(r => {
        this.userInfo = r.data
      })

      this.$axios({
        url: '/hotels',
        params: {id}
      }).then(r => {
        const {data: {data: [data]} } = r
        this.hotel = data
        this.loaded = true
      })

      // 获取评论列表
      this.$axios({
        url: '/hotels/comments',
        // params: {id} // 数据不支持
      }).then(r => {
        this.comments = r.data
      })
    },

    computed: {
      scores () {
        const {environment, product, service} = this.hotel.scores
        return {
          environment: {name: '环境', value: environment},
          product: {name: '产品', value: product},
          service: {name: '服务', value: service},
        }
      },

      photoList() {
        return [...new Array(6)].map((_, i) => {
          return {
            name: this.hotel.name,
            value: `/images/hotel-pics/${i+1}.jpeg`
          }
        })
      },

      recomment() {
        const {hotel: { stars }} = this
        let r = '一般'
        if (stars > 4) {
          r = '非常推荐'
        } else if (stars > 3) {
          r = '推荐'
        }
        return r
      }
    },

    methods: {
      onPriceRowClick() {
        window.open('https://hotels.ctrip.com/hotel/694679.html', '_blank')
      }
    },

    components: {
      detailMap,
      starBudget,
      rateBudget,
      photoView,
      circleRate,
      commentsView,
    }
  }
</script>

<style scoped lang="less">
  .container {
    width: 1000px;
    margin: 0 auto;

    .height-light {
      color: #f90;
    }

    .larger {
      font-size: larger;
    }

    .x-large {
      font-size: x-large;
    }

    .breadcrumb {
      overflow: hidden;
      padding: 20px 0;
    }

    .name-info {
      margin-bottom: 20px;
      color: #666;
      font-size: 14px;
    }

    .hotel-cn-name {
      color: #333;
      font-weight: normal;
      font-size: x-large;
    }
    .hotel-en-name {
      margin-bottom: 0.5em;
    }

    .box-card {
      margin: 20px 0;
    }

    .scores-row {
      color: #666;
      padding: 20px 0;
    }
    .score-item {
      margin-top: 6px;
    }

    .base-info {
      color: #666;
      font-size: 14px;
    }

    .assets-info {
      border-bottom: 1px solid #eee;

      .assets-info-hd,
      .assets-info-bd {
        padding: 20px 10px;
        font-size: 14px;
      }
      .assets-info-item {
        border: 1px solid #eee;
        padding: 4px 10px;
        margin-right: 10px;
        border-radius: 4px;
        background-color: #eee;
        color: #666;
      }
    }

    .info-row {
      margin: 40px 0;
    }

    .empty-page {
      text-align: center;
    }

    .rate-box {
      width: 70px;
    }

    .recomment-score {
      position: relative;
      display: flex;
      align-content: center;
    }
    .comment-star {
      margin-top: 20px;
    }
    .stamp {
      position: absolute;
      left: 20px;
      border: 2px solid #fa3;
      text-align: center;
      line-height: 70px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      opacity: 0.25;
      transform: rotate(-30deg);
    }
  }
</style>
