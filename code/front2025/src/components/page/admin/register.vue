<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="login-header">
        <h2>Fashion Style</h2>
        <p>계정을 생성하세요</p>
      </div>

      <el-form :model="param" :rules="rules" ref="login" class="ms-content" label-width="0">
        <el-form-item prop="phone">
          <el-input v-model="param.phone" placeholder="휴대폰 번호를 입력하세요">
            <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="비밀번호를 입력하세요"
            v-model="param.password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            placeholder="비밀번호 확인"
            v-model="param.repassword">
            <i slot="prefix" class="el-input__icon el-icon-key"></i>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" round @click="submitForm()">회원가입</el-button>
        </div>
      </el-form>

      <div class="login-footer">
        <router-link to="/" class="footer-link">홈으로 돌아가기</router-link>
        <router-link to="/userlogin" class="footer-link">로그인하기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value && value != "") {
                if (!/^1[0-9]{10}$/.test(value)) {
                    callback(new Error("올바른 휴대폰 번호를 입력하세요"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            param: {
                phone: '',
                password: '',
                repassword: '',
                type:'02'
            },
            imageUrl:'',
            imageUrl2:'',
            imageUrl3:'',
            rules: {
                phone: [
                    { required: true, message: '휴대폰 번호를 입력하세요', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'change'}
                ],
                password: [
                    { required: true, message: '비밀번호를 입력하세요', trigger: 'blur' },
                    { min: 6, max: 20, message: '비밀번호 길이는 6~20자여야 합니다', trigger: 'blur' }
                ],
                repassword: [
                    { required: true, message: '비밀번호 확인을 입력하세요', trigger: 'blur' },
                    { min: 6, max: 20, message: '비밀번호 길이는 6~20자여야 합니다', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$axios.post('/api/register', this.param).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('회원가입 성공');
                            this.$router.push('/');
                        } else
                            this.$message.error(res.data.msg);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleExceed(files, fileList) {
            this.$message.warning(`현재 1개의 파일만 업로드 가능합니다`);
        },
    }
};
</script>


<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, rgba(243, 195, 204, 0.8), rgba(243, 195, 204, 0.4)), url(../../../assets/img/1.jpg);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ms-login {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.ms-content {
  margin: 20px 0;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  height: 40px;
}

.el-input__inner {
  height: 40px;
  line-height: 40px;
  padding-left: 44px !important;
  background: #f5f7fa;
  border: none;
  border-radius: 20px;
}

.el-input__icon {
  line-height: 40px;
  color: #909399;
  font-size: 16px;
  margin-left: 8px;
}

.login-btn {
  text-align: center;
  margin-top: 30px;
}

.login-btn button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background: #f3c3cc;
  border: none;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.login-btn button:hover {
  background: #f1b5c1;
  transform: translateY(-2px);
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.footer-link {
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #f3c3cc;
}

/* 覆盖 Element UI 的默认样式 */
:deep(.el-form-item.is-error .el-input__inner) {
  border-color: #F56C6C;
}

:deep(.el-button--primary:focus, .el-button--primary:hover) {
  background: #f1b5c1;
  border-color: #f1b5c1;
}

/* 错误提示样式优化 */
:deep(.el-form-item__error) {
  padding-left: 15px;
  font-size: 12px;
}

/* 输入框聚焦效果 */
:deep(.el-input__inner:focus) {
  border-color: #f3c3cc;
  background: #fff;
}

/* 密码强度提示样式 */
.password-strength {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}

.strength-item {
  display: inline-block;
  width: 60px;
  height: 4px;
  margin-right: 5px;
  background: #DCDFE6;
  border-radius: 2px;
}

.strength-item.active {
  background: #f3c3cc;
}
</style>