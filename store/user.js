// 用户管理
// 可以在models中抽象一层，类似flux设计

export const state = () => ({
    userinfo: {
        token: "",
    },
}) 

export const mutations = {

    setUserInfo(state, info){
        const {password, ...props} = info;

        state.userinfo = props;
        if(process.browser){
            localStorage.setItem("userinfo", JSON.stringify(info));
        }
    },

    cleanUserInfo(state, info){
        if(process.browser){
            localStorage.removeItem("userinfo");
        }
        state.userinfo = {};
    }
}

// export const actions = {
//     login({commit}, data, cb){
//         this.$axios({
//             url: api.CAPTCHA,
//             method: "POST",
//             data: {
//                 tel: this.regForm.username
//             }
//         }).then(res => {
//             const {code} = res.data;
//             this.$confirm(`模拟手机验证码为：${code}`, '提示', {
//                 confirmButtonText: '确定',
//                 showCancelButton: false,
//                 type: 'warning'
//             })
//         })
//     }
// }