<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <div class="main">
                <div class="air-column">
                    <h2>剩机人</h2>
                    <el-form class="member-info">
                        <div class="member-info-item" v-for="(item, index) in users" :key="index">
                            <el-form-item label="乘机人类型">
                                <el-input placeholder="姓名" v-model="item.username" class="input-with-select">
                                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                                        <el-option label="成人" value="1"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="证件类型">
                                <el-input placeholder="证件号码" v-model="item.id"  class="input-with-select">
                                    <el-select v-model="item.idType" slot="prepend" placeholder="请选择">
                                        <el-option label="身份证" value="1" :checked="true"></el-option>
                                        <el-option label="护照" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <span class="delete-user" @click="handleDleteUser(index)">-</span>
                        </div>
                    </el-form>

                    <el-button class="add-member" type='primary' @click="handleAddUsers">添加乘机人</el-button>
                </div>

                <div class="air-column">
                    <h2>保险</h2>
                    <div>
                        <div class="insurance-item" v-for="(item, index) in infoData.insurances" :key="index">
                            <el-checkbox 
                            :label="`${item.type}：￥${item.price}/份×${users.length}  最高赔付${item.compensation}`" 
                            :v-model="item.id"
                            @change="handleInsurance(item.id)"
                            border></el-checkbox> 
                        </div>
                    </div>
                </div>

                <div class="air-column">
                    <h2>联系人</h2>
                    <div class="contact">
                        <el-form label-width="60px">
                            <el-form-item label="姓名">
                                <el-input v-model="contactName"></el-input>
                            </el-form-item>
                            <el-form-item label="手机">
                                <el-input placeholder="请输入内容" v-model="contactPhone">
                                    <template slot="append">
                                    <el-button @click="handleSendCaptcha">发送验证码</el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="验证码">
                                <el-input v-model="captcha"></el-input>
                            </el-form-item>
                        </el-form>   
                        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
                    </div>
                </div>
            </div>

            <div class="aside">
                <div class="air-info">
                    <el-row type="flex" justify="space-between" class="info-top">
                        <div>{{infoData.dep_date}}</div>
                        <div>{{infoData.org_city_name}} - {{infoData.dst_city_name}}</div>
                    </el-row>    
                    <el-row type="flex" justify="space-between" align="middle" class="info-step">
                        <el-col :span="5" class="flight-airport">
                            <strong>{{infoData.dep_time}}</strong>
                            <span>{{infoData.org_airport_name}}{{infoData.org_airport_quay}}</span>
                        </el-col>
                        <el-col :span="14" class="flight-time">
                            <span>--- {{rank_time}} ---</span>
                            <span>{{infoData.airline_name}}{{infoData.flight_no}}</span>
                        </el-col>
                        <el-col :span="5" class="flight-airport">
                            <strong>{{infoData.arr_time}}</strong>
                            <span>浦东机场T2</span>
                        </el-col>
                    </el-row> 
                </div>
                <el-row type="flex" justify="space-between" class="info-bar">
                    <span>订单总价</span>
                    <span>金额</span>
                    <span>数量</span>
                </el-row>
                <el-row type="flex" justify="space-between" class="info-bar">
                    <span>成人机票</span>
                    <span>￥{{infoData.seat_infos.org_settle_price}}</span>
                    <span>x1</span>
                </el-row>
                <el-row type="flex" justify="space-between" class="info-bar">
                    <span>机建＋燃油</span>
                    <span>¥{{infoData.airport_tax_audlet}}/人/单程</span>
                    <span>x1</span>
                </el-row>
                <el-row type="flex" justify="space-between" align="middle" class="info-bar">
                    <span>应付总额：</span>
                    <span class="price">￥{{allPrice}}</span>
                </el-row>           
            </div>
        </el-row>
    </div>
</template>

<script>

export default {
    data(){
        return {
            profile: "1",
            infoData: {
                seat_infos: {},
                insurances: []
            },
            rank_time: "",
            select: "1", // 暂时用不上，只有成人一个选项

            // form
            users: [{
                username: "",
                id: "",
                idType: "1"
            }],
            insurances: [],
            contactName: "",
            contactPhone: "13312882474",
            captcha: "000000",
            invoice: false,
            // ---
        }
    },

    computed: {
        allPrice(){
            let price = 0;
            let len = this.users.length;

            price += this.infoData.seat_infos.org_settle_price * len;

            this.insurances.forEach(v => {
                price += this.infoData.insurances[v - 1].price * len;
            });

            price += this.infoData.airport_tax_audlet * len;
            
            return price;
        }
    },

    methods: {
        handleAddUsers(){
            this.users = [...this.users, {
                username: "",
                id: "",
                idType: ""
            }];
        },
        handleDleteUser(index){
            this.users.splice(index, 1);
        },
        handleInsurance(id){
            if(this.insurances.indexOf(id) > -1){
                let arr = this.insurances.slice(0);
                arr.splice(this.insurances.indexOf(id), 1);
                this.insurances = arr;
            }else{
                this.insurances = [...new Set([...this.insurances, id])]
            }
        },
        
        // 发送手机验证码
        handleSendCaptcha(){
            if(!this.contactPhone){
                this.$confirm('手机号码不能为空', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    })
                return;
            }
            
            if(this.contactPhone.length !== 11){
                this.$confirm('手机号码格式错误', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                })
                return;
            }

            const {api} = this.$store.state;
            this.$axios({
                url: api.CAPTCHA,
                method: "POST",
                data: {
                    tel: this.contactPhone
                }
            }).then(res => {
                const {code} = res.data;
                this.$confirm(`模拟手机验证码为：${code}`, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                })
            })
        },

        handleSubmit(){
            const {api, user: {userinfo}} = this.$store.state;

            this.$message({
                message: "正在生成订单！请稍等",
                type: "success"
            })

            this.$axios({
                url: api.AIR_ORDERS,
                method: "POST",
                data: {
                    users: this.users,
                    insurances: this.insurances,
                    contactName: this.contactName,
                    contactPhone: this.contactPhone,
                    invoice: this.invoice,
                    captcha: this.captcha,
                    seat_xid: this.infoData.seat_infos.seat_xid,
                    air: this.infoData.id
                },
                headers: {
                    Authorization: `Bearer ${userinfo.token}`
                }
            }).then(res => {
                const {data: {id}} = res.data;
                this.$router.push({
                    path: "/air/pay",
                    query: {
                       id
                    }
                });
            }).catch(err => {
                const {message} = err.response.data;
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                })
            })
        }
    },

    mounted(){
        const {api} = this.$store.state;
        const {query} = this.$route;

        this.$axios({
            url: api.AIRS + `/${query.id}`,
            params: {
                seat_xid: query.seat_xid
            }
        }).then(res => {
            this.infoData = res.data;

            //  ---
            const dep = this.infoData.dep_time.split(":");
            const arr = this.infoData.arr_time.split(":");
            const depVal = dep[0] * 60 + +dep[1];
            const arrVal = arr[0] * 60 + +arr[1];

            let dis = arrVal - depVal;

            if(dis < 0){
                dis = arrVal + 24 * 60 - depVal;
            }

            this.rank_time = `${ Math.floor(dis / 60)}时${dis % 60}分`
            //  ---
        })
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*main*/
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }

    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }

    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select{
        width:590px;
    }

    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }

    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;

        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }

    .add-member{
        margin-top:20px;
    }

    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }

    .insurance{
        > div{
            margin-top:10px;
        }
    }

    .insurance-item{
        margin-bottom: 20px;
    }

    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }

    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }

    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }

    .air-info{
        padding:15px;

        .info-top{
            margin-bottom:10px;
            > div:last-child{
                font-size:14px;
            }
        }

        .info-step{
            .flight-airport{
                strong{
                    display: block;
                    font-size: 22px;
                    font-weight: normal;
                }

                span{
                    font-size: 12px;
                    color:#999;
                }
            }

            .flight-time{
                text-align: center;
                font-size: 12px;
                color:#999;
                span{
                    display: block;
                }
            }
        }
    }

    .info-bar{
        border-top:1px #ddd dashed;
        padding: 10px 15px;
        font-size: 14px;
        color: #666;

        .price{
            font-size:28px;
            color: orange;
        }
    }
</style>
