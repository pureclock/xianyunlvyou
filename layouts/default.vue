<template>
  <div>
    <Header/>
    <nuxt />
    <Footer/>
  </div>
</template>

<script>

import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default {
  components: {
    Header,
    Footer
  },
  // default中无法触发
  async asyncData (context) {
      console.log(context, 123)
      return null;
  }
}

</script>

<style lang="less">

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*{
  margin:0; 
  padding:0;
}
ul, li, ol{
  list-style:none;
}
a{
  text-decoration:none;
  color:inherit;
}
a:hover{

}
em,i{
  font-style: normal;
}

</style>
