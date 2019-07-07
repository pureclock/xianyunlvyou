<template>
  <section class="container">
    <!-- 面包屑导航条 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>酒店</el-breadcrumb-item>
        <el-breadcrumb-item>{{cityName}}酒店预订</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索栏 -->
    <searchBar :defaultValue="{cityName, ...searchParams }" :onChange="handleSearchSubmit" class="hotel-search-bar" />

    <!-- 可选搜索条件 -->
    <el-row type="flex" :gutter="10" class="hotel-option-row" v-if="cityData">
      <el-col :span="14">
        <searchOptions :defaultValue="searchParams.scenic" :scenics="cityData.scenics" :onClick="handleOptionClick" />
      </el-col>
      <el-col :span="10">
        <mapView :value="hotels.data" width="420" height="260" />
      </el-col>
    </el-row>

    <!-- 列表条件过滤器 -->
    <listFilter
      :topPrice="4000"
      :defaultValue="searchParams"
      :hotelOptions="hotelOptions"
      :onChange="handleFiltersChange"
    />

    <!-- 搜索结果列表展示 -->
    <div class="hotel-list" v-if="loaded">
      <div class="no-result" v-if="hotels.total === 0">
        暂无符合条件的酒店
      </div>
      <div v-else>
        <itemView v-for="item in hotels.data" :key="item.id" :dataSource="item"/>
        <div class="pagination-box" v-if="totalPages > 0">
          <Pagination :defaultValue="searchParams.page" :total="totalPages" :onChange="handlePageChange" />
        </div>
        </div>
      </div>
    </div>
    <div class="hotel-list-loading" v-else>
      <img src="/images/loading.gif" alt="loading">
    </div>
  </section>
</template>

<script>
  import _omit from 'lodash/omit'
  import _pickBy from 'lodash/pickBy'
  import _isEmpty from 'lodash/isEmpty'
  import searchBar from "@/components/hotel/searchBar";
  import searchOptions from "@/components/hotel/searchOptions";
  import mapView from "@/components/hotel/mapView";
  import listFilter from "@/components/hotel/listFilter";
  import itemView from "@/components/hotel/itemView";
  import Pagination from "@/components/hotel/Pagination";


  function parseQueryString(params) {
    let qs = ''
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        let v = params[key]
        if (Array.isArray(v)) {
          v.forEach(x => {
            if (x) {
              qs += `&${key}_in=${x}`
            }
          })
        } else {
          if(v) qs += `&${key}=${v}`
        }
      }
    }
    return qs ? `?${qs}` : qs
  }

  export default {
    data() {
      return {
        loaded: false,
        cityData: null,
        cityName: '南京',
        searchParams: {
          //_limit: 5,
          // city: 73,
          //price_lt: 4000,
          ...this.$route.query,
        },
        hotels: {},
        hotelOptions: {},
      }
    },

    mounted: async function () {
      this.handleSearchSubmit()

      const res = await this.$axios({url: '/hotels/options'})
      const data = res.data.data
      const hotelOptions = {}
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          hotelOptions[key] = data[key].map(d => ({value: d.id, label: d.name}))
        }
      }
      this.hotelOptions = hotelOptions
    },

    components: {
      searchBar,
      searchOptions,
      mapView,
      listFilter,
      itemView,
      Pagination,
    },

    methods: {
      getCityData(name) {
        return this.$axios({url: '/cities', params: {name}})
      },
      async handleSearchSubmit(searchParams = {}) {
        const {cityName, ...othersParams} = searchParams
        const params = {...this.searchParams, ...othersParams}
        const {page = 1} = params
        this.searchParams = _omit(params, ['adultCount', 'childCount', 'cityName'])

        this.loaded = false
        this.hotels = {}

        // 更新城市数据
        if (this.cityName !== cityName || !this.searchParams.city) {
          const {data: {data: [cityData]}} = await this.getCityData(cityName || this.cityName)
          this.cityData = cityData
          this.searchParams.city = cityData.id
          this.cityName = cityData.name
        }

        // 在URL上添加/替换参数
        this.$router.replace({
          path: 'hotel',
          query: _pickBy(this.searchParams, v => v && v.toString().length > 0)
        })

        // URL上显示page，而请求参数改成index
        const qsParams = _omit(this.searchParams, 'page')
        const qs = parseQueryString({...qsParams, _start: (page - 1) * 5})
        // 根据新的过滤条件获取新数据
        const res = await this.$axios({
          url: `/hotels${qs}`,
        })

        this.hotels = res.data
        if (res.data.total) {
          this.locationList = res.data.data[0].location
        }

        this.loaded = true
      },
      handleFiltersChange(filters) {
        this.handleSearchSubmit(filters)
      },
      handlePageChange(page) {
        this.handleSearchSubmit({page})
      },
      handleOptionClick(location) {
        const {id} = location || {}
        this.handleSearchSubmit({scenic: id})
      },
    },

    computed: {
      totalPages() {
        return Math.ceil(this.hotels.total / 5)
      },
    }
  }
</script>

<style scoped lang="less">
  .container {
    width: 1000px;
    margin: 0 auto;

    .breadcrumb {
      overflow: hidden;
      padding: 20px 0;
    }
    .hotel-option-row {
      min-height: 260px;
      margin-bottom: 20px;
    }

    .pagination-box {
      display: flex;
      justify-content: flex-end;
      padding: 20px 0 40px 0;
    }

    .no-result,
    .hotel-list-loading {
      text-align: center;
      height: 300px;
      margin-top: 20px;
    }
  }
</style>
