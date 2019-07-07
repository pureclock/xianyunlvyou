<template>
    <div class="search-form">
        <el-row type="flex" class="search-tab">
          <span v-for="(item, index) in tabs" :key="index"
          @click="handleSearchTab(item, index)"
          :class="{active: index === currentTab}">
            <i :class="item.icon"></i>{{item.name}}
          </span>
        </el-row>
        <el-form class="search-form-content" ref="form" label-width="80px">
          <el-form-item label="出发城市">
            <el-autocomplete
              :fetch-suggestions="queryDepartSearch"
              placeholder="请搜索出发城市"
              @select="handleDepartSelect"
              class="el-autocomplete"
              v-model="depart"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="到达城市">
            <el-autocomplete
              :fetch-suggestions="queryDestSearch"
              placeholder="请搜索到达城市"
              @select="handleDestSelect"
              class="el-autocomplete"
              v-model="dest"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="出发时间">
            <el-date-picker type="date" 
            placeholder="2019-04-30" 
            v-model="form.departDate" 
            style="width: 100%;"
            @change="handleDate">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-button style="width:100%;" 
            type="primary" 
            icon="el-icon-search"
            @click="handleSubmit">
                搜索
            </el-button>
          </el-form-item>

          <div class="reverse">
            <span @click="handleReverse">换</span>
          </div>
        </el-form>  
      </div>
</template>

<script>

import moment from "moment";

export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            depart: "",
            dest: "",
            form: {
                departValue: "",
                destValue: "",
                departDate: "",
            },

            currentTab: 0,
            isLoading: false
        }
    },
    methods: {
        handleSearchTab(item, index){
            if(index === 1){
              this.$confirm("目前暂不支持往返，请使用单程选票！", '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning'
              })
            }
        },

        async queryDepartSearch(value, cb){
          const arr =  await this.querySearchAsync(value)
          // 不在下拉列表中选择，则默认选择第一项
          this.form.departValue = arr[0];
          cb(arr)
        },

        async queryDestSearch(value, cb){
          const arr =  await this.querySearchAsync(value)
          // 不在下拉列表中选择，则默认选择第一项
          this.form.destValue = arr[0];
          cb(arr)
        },

        querySearchAsync(queryString) {
          return new Promise((resolve, reject) => {
            if(!queryString){
                return resolve([]);
            }
            if(this.isLoading) return;
            
            const {api} = this.$store.state;

            this.$axios({
                url: api.AIRS_CITY,
                params: {
                    name: queryString
                }
            }).then(res => {
                this.isLoading = false;
                
                const {data} = res.data;
                
                const arr = data.map(v => {
                    return {
                        ...v,
                        value: v.name.replace("市", "")
                    }
                });

                resolve(arr);
            })
          })
        },

        handleSelect(item, type){
            // 没有CAN字段
            // if(!item.sort) {
            //     const {api} = this.$store.state;

            //     this.$axios({
            //         url: api.AIRS_CITY_SORT,
            //         params: {
            //             name: item.name
            //         }
            //     }).then(res => {
            //         const {data} = res.data;

            //         item.sort = data;

            //         type === "depart" && (this.form.departValue = item);
            //         type === "dest" &&  (this.form.destValue = item);
            //     })
            // }else{
            //     type === "depart" && (this.form.departValue = item);
            //     type === "dest" &&  (this.form.destValue = item);
            // }

        },

        handleDepartSelect(item) {
            // this.handleSelect(item);
            this.form.departValue = item;
        },

        handleDestSelect(item) {
            // this.handleSelect(item, "dest");
            this.form.destValue = item;
        },

        handleDate(value){
            this.form.departDate = moment(value).format("YYYY-MM-DD");
        },

        handleReverse(){
            const { depart, dest, form:{departValue, destValue} } = this;

            this.depart = dest;
            this.dest = depart;

            this.form.departValue = destValue;
            this.form.destValue = departValue;
        },

        handleSubmit(){
            const rules = {
                departValue: {require: true, defaults: this.depart, message: "请选择出发城市"},
                destValue: {require: true, defaults: this.dest, message: "请选择到达城市"},
                departDate: {require: true, message: "请选择出发时间"},
            }

            // valid
            let valid = true;

            Object.keys(this.form).forEach(v => {
                if(!valid) return;

                if(rules[v].require && !this.form[v]){
                    valid = false;
                    if(rules[v].defaults){
                          this.$confirm("出发或者到达城市不存在，请在下拉框中选择城市", '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'warning'
                          })
                         return;
                    }

                    this.$confirm(rules[v].message, '提示', {
                      confirmButtonText: '确定',
                      showCancelButton: false,
                      type: 'warning'
                    })
                }
            });

            if(!valid) return;

            const queryData = {
                departCity: this.form.departValue.value,
                departCode: this.form.departValue.sort,
                destCity: this.form.destValue.value,
                destCode: this.form.destValue.sort,
                departDate: this.form.departDate,
            }

            // 添加到本地存储
            const airs = JSON.parse(localStorage.getItem('airs') || `[]`);
            airs.push(queryData);

            if(airs.length > 5) airs.length = 5;
            
            localStorage.setItem("airs", JSON.stringify(airs))

            this.$router.push({
                path: "/air/flights",
                query: queryData
            })
        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}

</style>
