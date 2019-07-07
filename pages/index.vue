<template>
  <section class="container">
    <!-- 幻灯片 -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div class="banner-image" 
        :style="`
          background:url(${$axios.defaults.baseURL}${item.url}) center center no-repeat;
          background-size:contain contain;
        `">
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 搜索框 -->
    <div class="banner-content">
      <div class="search-bar">
        <el-row type="flex" class="search-tab">
          <span v-for="(item, index) in options" :key="index" 
          :class="{active: index === currentOption}"
          @click="handleOption(index)">
            <i>{{item.name}}</i>
          </span>
        </el-row>
        <el-row type="flex" align="middle" class="search-input">
          <input 
          :placeholder="options[currentOption].placeholder" 
          v-model="searchValue"
          @keyup.enter="handleSearch"/>
          <i class="el-icon-search" @click="handleSearch"></i>
        </el-row>
      </div>
    </div>

    <!-- 攻略列表 -->
    <!-- <div class="main">
      <el-row type="flex" justify="space-between"> -->
        <!-- 内容左侧 -->
        <!-- <div class="post-wrapper">
          <el-row type="flex"  justify="space-between"  align="middle" class="post-title">
            <h4>
              热门游记 
            </h4>
            <el-button type="primary" 
            icon="el-icon-edit" 
            @click="$router.push(`/post/create`)">
            写游记
            </el-button>
          </el-row>

          <el-row type="flex" align="middle" justify="space-between" class="post-filter">
            <div class="filter-list">
              <span>筛选：</span>
              <span v-for="(item, index) in [`北京`, `广州`, `上海`]" :key="index"
              >
                {{item}}
              </span>
            </div>
            <div class="post-search">
              <el-input size="small" placeholder="请输入内容" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-row>

          <div class="post-list">
            <postCard v-for="(item, index) in [1,1,1,]" :key="index"></postCard>
          </div>

          <el-row type="flex" justify="center" style="margin-top:10px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </el-row>
        </div> -->

        <!-- 内容侧边栏 -->
        <!-- <div class="aside">
          <div class="aside-item" v-for="(item, index) in [1,1]" :key="index">
            <el-row type="flex" justify="space-between" align="middle" class="aside-title">
              <h4>最新活动</h4>
              <nuxt-link to="#">查看全部</nuxt-link>
            </el-row>
            <nuxt-link to="#"><img src="https://b1-q.mafengwo.net/s13/M00/A2/E2/wKgEaVycfy2AdX8nAAG2nu3fFV851.jpeg?imageView2%2F2%2Fw%2F260%2Fh%2F178%2Fq%2F90"></nuxt-link>
          </div>
        </div>
      </el-row>
    </div> -->

  </section>
</template>

<script>

import postCard from "@/components/post/postCard";

export default {
  data(){
    return {
      banners: [],
      options: [
        {name: "攻略", placeholder: "搜索城市", pageUrl: "/post?city="},
        {name: "酒店", placeholder: "请输入城市搜索酒店", pageUrl: "/hotel?city="},
        {name: "机票", placeholder: "请输入出发地", pageUrl: "/air"}
      ],
      searchValue: "",
      currentOption: 0,
      pageIndex: 1
    }
  },

  methods: {
    handleOption(index){
      this.currentOption = index;
      const item = this.options[index];

      if(item.name === "机票"){
        return this.$router.push(item.pageUrl);
      }
    },

    handleSearch(){
      const item = this.options[this.currentOption];
      this.$router.push(item.pageUrl + this.searchValue);
    }
    // handleSizeChange(){},
    // handleCurrentChange(){}
  },

  components: {
    postCard
  },
  
  mounted(){
    const {api} = this.$store.state;

    this.$axios({
      url: api.INDEX_BANNERS
    }).then(res => {
      const {data} = res.data;
      this.banners = data;
    })
  }
}
</script>

<style scoped lang="less">
.aside-item{
  .aside-title{
    padding:15px 0;
    h4{
      font-weight: normal;
      font-size: 18px;
    }
    
    a{
      font-size: 12px;
      color:#999;
    }
  }
}

.main{
  width:1000px;
  margin:20px auto;
}

.post-wrapper{
  width:700px;
}

.post-title{
  padding-bottom:10px;
  border-bottom:1px #eee solid;
  position: relative;

  h4{
    font-weight: normal;
    font-size: 18px;
    color:orange;

    &:after{
      display:block;
      content: "";
      width:72px;
      height:2px;
      background:orange;
      position: absolute;
      bottom:0;
      left:0;
    }
  }
}

.post-filter{
  padding:10px 0;
  border-bottom:1px #eee solid;

  .filter-list{
    font-size: 12px;
    color: #666;

    span{
      margin-right:10px;
    }
  }
}

.container{
  min-width:1000px;
  margin:0 auto;
  position:relative;

  .banner-content{
    z-index:9;
    width:1000px;
    position:absolute;
    left:50%;
    top:45%;
    margin-left: -500px;
    border-top:1px transparent solid;

    .search-bar{
      width:552px;
      margin:0 auto;
    }

    .search-tab{
      .active{
        i{
          color:#333;
        }
        &::after{
          background: #eee;
        }
      }

      span{
        width:82px;
        height:36px;
        display:block;
        position: relative;
        margin-right:8px;
        cursor: pointer;

        i{
          position:absolute;
          z-index:2;
          display: block;
          width:100%;
          height:100%;
          line-height:30px;
          text-align:center;
          color:#fff;
        }

        &:after{
          position: absolute;
          left:0;
          top:0;
          display:block;
          content: "";
          width:100%;
          height:100%;
          border: 1px rgba(255,255,255,.2) solid;
          border-bottom: none;
          transform: scale(1.1,1.3) perspective(.7em) rotateX(2.2deg);
          transform-origin: bottom left;
          background: rgba(0,0,0,.5);
          border-radius:1px 2px 0 0;
          box-sizing:border-box;
        }
      }
    }

    .search-input{
      width:550px;
      height:46px;
      background:#fff;
      border-radius: 0 4px 4px 4px;
      border: 1px rgba(255,255,255,.2) solid;
      border-top:none;
      box-sizing: unset;

      input{
        flex:1;
        height:20px;
        padding: 13px 15px;
        outline: none;
        border:0;
        font-size:16px;
      }

      .el-icon-search{
        cursor :pointer;
        font-size:22px;
        padding:0 10px;
        font-weight:bold;
      }
    }
  }

  
}

/deep/ .el-carousel__container{
  height:700px;
}

.banner-image{
  width:100%;
  height:100%;
}
</style>
