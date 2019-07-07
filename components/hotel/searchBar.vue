<template>
  <el-form :inline="true" :model="searchFormData">
    <el-form-item>
      <el-autocomplete
        v-model="searchFormData.cityName"
        placeholder="目的地"
        value-key="name"
        :fetch-suggestions="querySearch"
        @select="handleCitySelect"
      />
      <!-- <el-input placeholder="目的地" suffix-icon="el-icon-search" v-model="searchFormData.city"/> -->
    </el-form-item>

    <el-date-picker
      v-model="daterange"
      :editable="false"
      :clearable="false"
      value-format="yyyy-MM-dd"
      type="daterange"
      range-separator="-"
      start-placeholder="入住日期"
      end-placeholder="离店日期"
      @change="onDateChange"
    />

    <el-form-item>
      <memberSelector
        :adultMemberList="adultMemberList"
        :childMemberList="childMemberList"
        :onChange="onMemeberChange"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查看价格</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import memberSelector from './memberSelector'

  function range(start, to) {
    const r = []
    for (let i = start; i < to; i++) {
      r.push(i)
    }
    return r
  }

  export default {
    props: ['onChange', 'defaultValue'],

    data() {
      const {
        city,
        cityName,
        enterTime,
        leftTime,
        adultCount,
        childCount
      } = this.defaultValue
      const daterange = [enterTime, leftTime].filter(v => !!v)
      return {
        cityList: [],
        adultMemberList: range(1, 8),
        childMemberList: range(0, 5),
        daterange,
        searchFormData: {
          cityName,
          city,
          enterTime,
          leftTime,
          adultCount,
          childCount,
        }
      }
    },

    methods: {
      onSubmit: function () {
        this.onChange(this.searchFormData)
      },

      async querySearch(queryString, cb) {
        if (!queryString) {
          return cb([])
        }
        const res = await this.$axios({url: '/cities', params: {name: queryString}})
        const {data} = res.data
        var results = data.filter(this.createFilter(queryString));
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      createFilter(queryString) {
        return (city) => {
          return (city.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      handleCitySelect(c) {
        // 城市 id
        this.searchFormData.city = c.id
        // 回调
        this.onChange(this.searchFormData)
      },

      onMemeberChange ([adultCount, childCount]) {
        this.searchFormData.adultCount = adultCount
        this.searchFormData.childCount = childCount
      },

      onDateChange ([enterTime, leftTime]) {
        this.searchFormData.enterTime = enterTime
        this.searchFormData.leftTime = leftTime
      }
    },

    components: {
      memberSelector,
    }
  }
</script>

<style scoped lang="less">

</style>
