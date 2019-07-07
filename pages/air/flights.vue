<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">
            <div class="flights-content"  v-loading="loading">
                <div class="filters">
                    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
                        <el-col :span="8">
                            单程：
                            {{flightsData.info.departCity}} 
                            - 
                            {{flightsData.info.destCity}} / 
                            {{flightsData.info.departDate}}
                        </el-col>
                        <el-col :span="4">
                            <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
                                <el-option
                                v-for="item in flightsData.options.airport"
                                :key="item"
                                :label="item"
                                :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-select size="mini" v-model="flightTimes"  placeholder="起飞时间" @change="handleFlightTimes">
                                <el-option
                                v-for="(item, index) in flightsData.options.flightTimes"
                                :key="index"
                                :label="`${item.from}:00 - ${item.to}:00`"
                                :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-select size="mini" v-model="company"  placeholder="航空公司" @change="handleCompany">
                                <el-option
                                v-for="(item, index) in flightsData.options.company"
                                :key="index"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
                                <el-option
                                v-for="item in sizeOptions"
                                :key="item.size"
                                :label="item.name"
                                :value="item.size">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <div class="filter-cancel">
                        筛选：<el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
                    </div>
                </div>

                <el-row class="flight-title">
                    <el-col :span="5">
                        航空信息
                    </el-col>
                    <el-col :span="14">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="12">
                                起飞时间
                            </el-col>
                            <el-col :span="12">
                                到达时间
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="5">
                        价格
                    </el-col>
                </el-row>

                <div>
                    <div class="flights-content"  v-if="!loading && dataList.length">
                        <div class="flight-item" v-for="(item, index) in  dataList" :key="index">
                            <div @click="handleShowLines(item)">
                                <el-row type="flex" align="middle" class="flight-info">
                                    <el-col :span="6">
                                        <span>{{item.airline_name}}</span> {{item.flight_no}}
                                    </el-col>
                                    <el-col :span="12">
                                        <el-row type="flex" justify="space-between" class="flight-info-center">
                                            <el-col :span="8" class="flight-airport">
                                                <strong>{{item.dep_time}}</strong>
                                                <span>{{item.org_airport_name}}{{item.org_airport_quay}}</span>
                                            </el-col>
                                            <el-col :span="8" class="flight-time">
                                                <span>{{item.rank_time}}</span>
                                            </el-col>
                                            <el-col :span="8" class="flight-airport">
                                                <strong>{{item.arr_time}}</strong>
                                                <span>{{item.dst_airport_name}}{{item.dst_airport_quay}}</span>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                    <el-col :span="6" class="flight-info-right">
                                        ￥<span class="sell-price">{{item.seat_infos[0].org_settle_price_child}}</span>起
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="flight-recommend" v-if="item.showLines">
                                <el-row type="flex"  justify="space-between" align="middle">
                                    <el-col :span="4">低价推荐</el-col>
                                    <el-col :span="20">
                                        <el-row type="flex" justify="space-between" align="middle" class="flight-sell" 
                                        v-for="(subItem, subIndex) in item.seat_infos"
                                        :key="subIndex">
                                            <el-col :span="16" class="flight-sell-left">
                                                <span>{{subItem.name}}</span> | {{subItem.supplierName}}
                                            </el-col>
                                            <el-col :span="5" class="price">
                                                ￥{{subItem.org_settle_price}}
                                            </el-col>
                                            <el-col :span="3" class="choose-button">
                                                <el-button 
                                                type="warning" 
                                                size="mini" 
                                                @click="handleChoose(item.id, subItem.seat_xid)">
                                                选定
                                                </el-button>
                                                <p>剩余：{{subItem.discount}}</p>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>

                        <el-row type="flex" justify="center" style="margin-top:10px;">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageIndex"
                            :page-sizes="[5, 10, 15, 20]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="flightsData.total">
                            </el-pagination>
                        </el-row>
                    </div>

                    <div class="flights-empty" v-if="!loading && !dataList.length">
                        暂无航班信息！
                    </div>
                </div>
            </div>


            <div class="aside">
                <div class="statement">
                    <el-row type="flex" justify="space-between" class="statement-list">
                        <el-col :span="8">
                            <i class="iconfont iconweibiaoti-_huabanfuben" style="color:#409EFF;"></i>
                            <span>航协认证</span>
                        </el-col>
                        <el-col :span="8">
                            <i class="iconfont iconbaozheng" style="color:green;"></i>
                            <span>出行保证</span>
                        </el-col>
                        <el-col :span="8">
                            <i class="iconfont icondianhua" style="color:#409EFF;"></i>
                            <span>7x24</span>
                        </el-col>
                    </el-row>
                    <p class="service-tel">
                        免费客服电话：4006345678转2
                    </p>
                </div>

                <div class="history">
                    <h5>历史查询</h5>
                    <nuxt-link :to="`/air/flights?departCity=${item.departCity}&departCode=${item.departCode}&destCity=${item.destCity}&destCode=${item.destCode}&departDate=${item.departDate}`"  
                    v-for="(item, index) in airsLog"
                    :key="index">
                        <el-row type="flex" 
                        justify="space-between" 
                        align="middle"
                        class="history-item">
                            <div class="air-info">
                                <div class="to-from">{{item.departCity}} - {{item.destCity}}</div>
                                <p>{{item.departDate}}</p>
                            </div>
                            <span>选择</span>
                        </el-row>
                    </nuxt-link>
                </div>
            </div>
        </el-row>
    </section>
</template>

<script>

import moment from "moment";

export default {
    data() {
      return {
        sizeOptions: [
            {name: "大", size: "L"},
            {name: "中", size: "M"},
            {name: "小", size: "S"},
        ],
        value: '',
        airsLog: [],
        flightsData: {
            info: {},
            options: {},
            flightTimes: []
        },
        loading: true,

        airport: "",
        flightTimes: "",
        company: "",
        airSize: "",

        dataList: [],
        cacheAllList: [], // 缓存全部列表
        pageIndex: 1,
        pageSize: 10,
      }
    },

    watch: {
        $route(){
             this.getData();
        }
    },

    methods: {
        handleSizeChange(value){
            this.pageSize = value;
            this.pageIndex = 1;
            this.setDataList();
        },

        handleCurrentChange(value){
            this.pageIndex = value;
            this.setDataList();
        },

        // 放到computed 
        setDataList(){
            const start = (this.pageIndex - 1) * this.pageSize; 
            const end = start + this.pageSize; 
            this.dataList = this.flightsData.flights.slice(start, end);

            // 修改总条数
            this.flightsData.total = this.flightsData.flights.length;
        },

        handleShowLines(item){
            this.dataList = this.dataList.map(v => {
                if(v.id == item.id){
                    v.showLines = !v.showLines;
                }
                return v;
            })
        },

        handleChoose(id, seatId){
            this.$router.push({
                path: "/air/order", 
                query: {
                    id,
                    seat_xid: seatId
                }
            })
        },

        handleAirport(value){
            this.pageIndex = 1;
            this.flightsData.flights = this.cacheAllList
            .filter(v => v.org_airport_name === value)
        },

        handleFlightTimes(value){
            this.flightsData.flights =this.cacheAllList
            .filter(v => {
                return value.from <= +v.dep_time.split(":")[0] && value.to >= +v.dep_time.split(":")[0]
            });
            this.setDataList();
        },

        handleCompany(value){
            this.pageIndex = 1;
            this.flightsData.flights = this.cacheAllList
            .filter(v => v.airline_name === value)
            this.setDataList();
        },

        handleAirSize(value){
            this.pageIndex = 1;
            this.flightsData.flights = this.cacheAllList
            .filter(v => v.plane_size === value)
            this.setDataList();
        },
        
        handleFiltersCancel(){
            this.airport = "";
            this.flightTimes = "";
            this.company = "";
            this.airSize = "";
            this.flightsData.flights = this.cacheAllList;
            this.setDataList();
        },

        handleLinkLog(log){
            this.$router.push({
                path: "/air/flights",
                query: log
            })
        },

        getData(){
            const {api} = this.$store.state;
            this.loading = true;
            
            this.$axios({
                url: api.AIRS,
                params: this.$route.query
            }).then(res => {
                this.flightsData = res.data;

                this.flightsData.flights = res.data.flights.map(v => {

                    const dep = v.dep_time.split(":");
                    const arr = v.arr_time.split(":");
                    const depVal = dep[0] * 60 + +dep[1];
                    const arrVal = arr[0] * 60 + +arr[1];

                    let dis = arrVal - depVal;

                    if(dis < 0){
                        dis = arrVal + 24 * 60 - depVal;
                    }

                    const rank_time = `${ Math.floor(dis / 60)}时${dis % 60}分`

                    return {
                        ...v,
                        showLines: false,
                        rank_time, 
                    }
                });

                this.cacheAllList = this.flightsData.flights;
                this.setDataList();
                this.loading = false;
            });
        }
    },

    mounted(){
        this.getData();

        // 获取历史记录
        this.airsLog = JSON.parse(localStorage.getItem("airs") || `[]`);
    }
}
</script>

<style scoped lang="less">

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .filters{
        margin-bottom:20px;
    }

    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }

    .filter-cancel{
        margin-top:10px;
    }

    .flight-title{
        padding:0 15px;
        border:1px #ddd solid;
        background:#f6f6f6;
        height:38px;
        line-height: 38px;
        color:#666;
        font-size:12px;
        margin-bottom: 10px;

        > div{
            text-align: center
        }
    }

    .flight-item{
        border:1px #ddd solid;
        margin-bottom: 10px;

        .flight-info{
            padding:15px;
            cursor: pointer;

            > div{
                &:first-child, &:last-child{
                    text-align: center;
                }
            }
        }

        .flight-info-center{
            padding:0 30px;
            text-align: center;

            .flight-airport{
                strong{
                    display: block;
                    font-size:24px;
                    font-weight: normal;
                }
                span{
                    font-size: 12px;
                    color:#999;
                }
            }

            .flight-time{
                span{
                    display: inline-block;
                    padding:10px 0;
                    border-bottom: 1px #eee solid;
                    color:#999;
                }
            }
        }

        .flight-info-right{
            
            .sell-price{
                font-size: 24px;
                color:orange;
                margin:0 2px;
            }
        }
        
    }

    .flight-recommend{
        background: #f6f6f6;
        border-top:1px #eee solid;
        padding:0 20px;

        .flight-sell{
            border-bottom:1px #eee solid;
            padding:10px 0;

            &:last-child{
                border-bottom: none;
            }

            .flight-sell-left{
                font-size: 12px;
                span{
                    color:green;
                }
            } 

            .price{
                font-size: 20px;
                color:orange;
            }

            .choose-button{
                text-align: center;
                color:#666;
                button{
                    display: block;
                    width:100%;
                    margin-bottom:5px;
                }
            }
        }
    }

    .flights-empty{
     text-align: center;
     color:#999;
     line-height: 2; 
    }

    /* ------------------------- */

    .contianer{
        width:1000px;
        margin:20px auto;

    }
    .aside{
        width:240px;
    }

    .statement{
        border:1px #ddd solid;

        .statement-list{
            padding: 10px 0;
            > div{
                text-align: center;
                i{
                    display: block;
                    font-size: 40px;
                }
                span{
                    font-size:12px;
                }
            }
        }
        .service-tel{
            height: 32px;
            line-height: 32px;
            padding:0 10px;
            background: #f6f6f6;
            font-size: 14px;
        }
    }

    .history{
        border:1px #ddd solid;
        padding:10px;
        margin-top:10px;

        h5{
            font-size: 16px;
            font-weight: normal;
            padding-bottom: 10px;
            border-bottom:1px #eee solid;
        }

        .history-item{
            padding:10px 0;
            font-size: 14px;
            border-bottom: 1px #eee solid;

            &:last-child{
                border:none;
            }

            .to-from{
                margin-bottom: 5px;
            }

            p{
                font-size: 12px;
                color:#666;
            }

            span{
                color:#fff;
                display: block;
                padding:2px 10px;
                background: orange;
                border-radius: 4px;
                font-size:12px;
                cursor: pointer;
            }
        }
    }

    
    
</style>
