<template>
  <el-dropdown placement="bottom-start" @command="hanldeChange" class="filter-dropdown">
    <span class="el-dropdown-link">
      <span class="dropdown-link-text">{{text}}</span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <div class="filter-view-menu-box">
        <el-dropdown-item
          v-for="item in dataSource"
          :command="item"
          :key="item.value"
        >
          <i class="iconfont iconright-1" v-if="value.map(v => v.value).includes(item.value)" />
          <i class="iconfont iconcircle" v-else />
          <span class="dropdown-menu-text">{{item.label}} </span>
          <slot />
        </el-dropdown-item>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    props: {
      defaultText: {type: String, default: '不限'},
      defaultValue: {type: Array | Number | String},
      dataSource: {type: Array},
      onChange: {type: Function, default: () => {}},
      multiply: {type: Boolean, default: true},
    },
    data() {
      return {
        value: []
      }
    },
    beforeUpdate() {
      const {dataSource, defaultValue = []} = this
      if (!dataSource) {
        return
      }
      const aValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue]
      const value = [];
      aValue.forEach(v => {
        const fd = dataSource.find(d => d.value == v)
        if (fd) {
          value.push(fd)
        }
      })
      this.value = value
    },
    methods: {
      hanldeChange(v) {
        let includes = false
        if (this.multiply) {
          // 切换选项
          if (this.value.includes(v)) {
            includes = true
            this.value = this.value.filter(d => d !== v)
          } else {
            this.value.push(v)
          }
        } else {
          // 单选
          if (this.value.includes(v)) {
            this.value = []
          } else {
            this.value = [v]
          }
        }

        // 回调
        this.onChange(this.value.map(i => i.value), this.value)
      },
    },

    computed: {
      text() {
        const length = this.value.length
        let {defaultText: text} = this
        switch(length) {
          case 0:
            text = '不限'
            break;
          case 1:
            text = this.value[0].label
            break;
          default:
            text = `已选${length}项`
        }
        return text
      }
    }
  }
</script>

<style>
  .filter-dropdown {
    position: relative;
    width: 100%;
  }
  .el-dropdown-link {
    display: flex;
    flex: 1;
    width: 100%;
    cursor: pointer;
  }
  .dropdown-link-text {
    flex: 1;
    font-size: 13px;
  }
  .el-icon--right {
    align-self: center;
  }
  .dropdown-menu-text {
    display: inline-block;
    min-width: 100px;
    margin-left: 10px;

  }
  .filter-view-menu-box {
    max-height: 230px;
    overflow: auto;
  }
</style>
