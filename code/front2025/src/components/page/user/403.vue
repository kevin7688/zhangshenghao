<template>
    <div class="error-page">
        <div class="error-code">4<span>0</span>3</div>
        <div class="error-desc">죄송합니다. 이 페이지에 접근할 권한이 없습니다.</div>
        <div class="error-handle">
            <router-link to="/">
              <el-button type="primary" size="large">홈으로 돌아가기</el-button>
            </router-link>
            <el-button class="error-btn" type="primary" size="large" @click="goBack">이전 페이지로 돌아가기</el-button>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
  }
  </script>
  

<style scoped>
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 250px;
        font-weight: bolder;
        color: #f02d2d;
    }
    .error-code span{
        color: #00a854;
    }
    .error-desc{
        font-size: 30px;
        color: #777;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom: 200px;
    }
    .error-btn{
        margin-left: 100px;
    }
</style>
