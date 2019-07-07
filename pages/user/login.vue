<template>
    <div class="container">
        <el-row type="flex" justify="center" align="middle" class="main">

            <div class="form-wrapper">
                <el-row type="flex" justify="center" class="tabs">
                    <span :class="{active: currentTab === index}" 
                    v-for="(item, index) in [`登录`, `注册`]"
                    :key="index" 
                    @click="handleChangeTab(index)">
                        {{item}}
                    </span>
                </el-row>

                <el-form 
                :model="loginForm" 
                ref="loginForm"
                :rules="loginRules" 
                class="form"  
                v-if="currentTab == 0">
                    <el-form-item class="form-item" prop="username">
                        <el-input 
                        placeholder="用户名/手机" 
                        v-model="loginForm.username"
                        ></el-input>
                    </el-form-item>

                    <el-form-item class="form-item" prop="password">
                        <el-input 
                        placeholder="密码" 
                        type="password" 
                        v-model="loginForm.password">
                        </el-input>
                    </el-form-item>
                    <p class="form-text">
                        <nuxt-link to="#">忘记密码</nuxt-link>
                    </p>
                    <el-button 
                    class="submit"
                    type="primary"
                    @click="handleLoginSubmit">
                    登录
                    </el-button>
                </el-form>

                <el-form 
                :model="regForm" 
                ref="regForm" 
                :rules="regRules" 
                class="form" 
                v-if="currentTab == 1">
                    <el-form-item class="form-item" prop="username">
                        <el-input 
                        placeholder="用户名手机" 
                        v-model="regForm.username">
                        </el-input>
                    </el-form-item>

                    <el-form-item class="form-item" prop="captcha">
                        <el-input 
                        placeholder="验证码" 
                        v-model="regForm.captcha">
                            <template slot="append">
                                <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="form-item" prop="nickname">
                        <el-input 
                        placeholder="你的名字" 
                        v-model="regForm.nickname">
                        </el-input>
                    </el-form-item>

                    <el-form-item class="form-item" prop="password">
                        <el-input 
                        placeholder="密码" 
                        type="password" 
                        v-model="regForm.password"
                        ></el-input>
                    </el-form-item>

                    <el-form-item class="form-item" prop="checkPassword">
                        <el-input 
                        placeholder="确认密码" 
                        type="password" 
                        v-model="regForm.checkPassword">
                        </el-input>
                    </el-form-item>

                    <el-button 
                    class="submit" 
                    type="primary" 
                    @click="handleRegSubmit">
                        注册
                    </el-button>
                </el-form>
            </div>
        </el-row>
    </div>
</template>

<script>
export default {
    layout: "", // 可配置为是否展示页头和页脚
    data(){

        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.regForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }

        return {
            currentTab: 0,
            
            loginForm: {
                username: "",
                password: ""
            },

            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
            },

            regForm: {
                username: "",
                password: "",
                checkPassword: "",
                nickname: "",
                captcha: ""
            },

            regRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                checkPassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                nickname: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                ],
            }
        }
    },

    methods: {
        handleChangeTab(index){
            this.currentTab = index;
        },
        
        handleSendCaptcha(){
            if(!this.regForm.username){
                this.$confirm('手机号码不能为空', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'warning'
                    })
                return;
            }
            
            if(this.regForm.username.length !== 11){
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
                    tel: this.regForm.username
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

        handleRegSubmit(){
            const {api} = this.$store.state;
            const {commit} = this.$store;

            this.$refs['regForm'].validate((valid) => {
                if (valid) {
                    // 注册提交
                    const {checkPassword, ...props} = this.regForm;

                    this.$axios({
                        url: api.REGISTER,
                        method: "POST",
                        data: props
                    }).then(res => {
                        const {user, token} = res.data;

                        if(user){
                            // 保存到vuex
                            commit("user/setUserInfo", {
                                ...user,
                                token
                            })

                            this.$message({
                                message: "注册成功，正在跳转",
                                type: "success"
                            });
                            setTimeout(() => {
                                this.$router.replace("/")
                            }, 1000);
                        }
                    })
                } 
            });
        },

        handleLoginSubmit(){
            const {api} = this.$store.state;
            const {commit} = this.$store;

            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.$axios({
                        url: api.LOGIN,
                        method: "POST",
                        data: this.loginForm
                    }).then(res => {
                        const {code} = res.data;
                        const {user, token} = res.data;

                        if(user){
                            // 保存到vuex
                            commit("user/setUserInfo", {
                                ...user,
                                token
                            })

                            this.$message({
                                message: "登录成功，正在跳转",
                                type: "success"
                            });
                            setTimeout(() => {
                                this.$router.replace("/")
                            }, 1000);
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
    .container{
        background:url(/images/bar1.jpg) center 0;
        height: 700px;
        min-width:1000px;
        
        .main{
            width:1000px;
            height: 100%;
            margin:0 auto;
            position: relative;
            
            .form-wrapper{
                width:400px;
                margin:0 auto;
                background:#fff;
                box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
                overflow:hidden;
               
               .tabs{
                    span{
                        display: block;
                        width:50%;
                        height: 50px;
                        box-sizing: border-box;
                        border-top:2px #eee solid;
                        background:#eee;
                        line-height: 48px;
                        text-align: center;
                        cursor: pointer;
                        color:#666;

                        &.active{
                            color:orange;
                            border-top-color: orange;
                            background:#fff;
                            font-weight: bold;
                        }
                    }
                }

                .form{
                    padding:25px;
                }

                .form-item{
                    margin-bottom:20px;
                }

                .form-text{
                    font-size:12px;
                    color:#409EFF;
                    text-align: right;
                    line-height: 1;
                }

                .submit{
                    width:100%;
                    margin-top:10px;
                }
            }
        }
    }
</style>
