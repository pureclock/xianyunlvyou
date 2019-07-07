<template>
  <div class="list-filter">
    <el-row type="flex" :gutter="40">
      <el-col class="filter-col" :span="8">
        <el-row type="flex" class="filter-title">
          <el-col>价格</el-col>
          <el-col class="ta-r">0-{{filters.price_lt}}</el-col>
        </el-row>
        <el-row>
          <el-slider
            :step="10"
            v-model="filters.price_lt"
            :min="0"
            :max="+this.topPrice"
            @change="v => this.handleChange('price_lt', v)"
          />
        </el-row>
      </el-col>

      <!-- <el-col class="filter-col" :span="6">
        <el-row type="flex" class="filter-title">
          <el-col>距离</el-col>
          <el-col>{{this.filters.distance}}公里</el-col>
        </el-row>

        <el-row>
          <el-slider
            :step="1"
            v-model="filters.distance"
            :min="1"
            :max="this.maxDistance"
            @change="v => this.handleChange('distance', v)"
          />
        </el-row>
      </el-col> -->


      <el-col class="filter-col" :span="6" v-for="item in listData" :key="item.value">
        <el-row class="filter-title">
          <el-col>{{item.label}}</el-col>
        </el-row>
        <el-row class="filter-wrapper">
          <filterView
            :defaultValue="filters[item.value]"
            :dataSource="hotelOptions[item.valueKey]"
            :onChange="v => handleChange(item.value, v)"
          />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import filterView from './filterView'
  export default {
    props: {
      defaultValue: {type: Object, default: {}},
      hotelOptions: {type: Object, default: []},
      topPrice: {type: Number, default: 4000},
      onChange: {type: Function, default: () => {}}
    },

    data() {
      const {
        hotellevel,
        price_lt,
        hotelasset,
        hoteltype,
        hotelbrand,
      } = this.defaultValue

      return {
        listData: [
          {label: '住宿等级', value: 'hotellevel', valueKey: 'levels'},
          {label: '住宿类型', value: 'hoteltype', valueKey: 'types'},
          {label: '酒店设施', value: 'hotelasset', valueKey: 'assets'},
          {label: '酒店品牌', value: 'hotelbrand', valueKey: 'brands'},
        ],
        filters: {
          price_lt: +price_lt || 4000,
          hotellevel,
          hoteltype,
          hotelasset,
          hotelbrand,
        }
      }
    },

    components: {
      filterView,
    },

    methods: {
      handleChange(key, value) {
        this.filters[key] = value
        this.onChange(this.filters)
      }
    }
  }
</script>

<style scoped lang="less">
  .list-filter {
    border: 1px solid #ddd;
    padding: 5px 20px;
    color: #666;
  }

  .ta-r {
    text-align: right;
  }

  .filter-col {
    border-right: 1px solid #ddd;
    padding: 5px 0;
  }

  .filter-title {
    font-size: 14px;
  }

  &:last-child {
    border: none;
  }

  .filter-wrapper {
    height: 38px;
    display: flex;
    align-items: center;
  }
</style>
