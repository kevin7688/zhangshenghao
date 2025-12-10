<template>
    <div class="header">
        <!-- 접기 버튼 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-operation"></i>
            <i v-else class="el-icon-s-home"></i>
        </div>
        <div class="logo">패션 스타일 커뮤니티</div>
        <div class="header-right">
            <div class="header-user-con">
                <div @click="goIndex" style="font-size: small;margin-right: 25px;cursor: pointer;">
                    홈으로 돌아가기
                </div>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span v-if="userType=='01'">관리자: {{userInfo.username}}</span>
                        <span v-if="userType=='02'">사용자: {{userInfo.realname}}</span>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="query" v-if="userType!=='01'">개인 정보</el-dropdown-item>
                        <el-dropdown-item divided command="update" v-if="userType!=='01'">정보 수정</el-dropdown-item>
                        <el-dropdown-item divided command="password">비밀번호 변경</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">로그아웃</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!-- 개인 정보 보기 -->
        <el-dialog
            title="개인 정보"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="프로필 사진" prop="realname">
                    <img :src="form.image"  class="avatar">
                </el-form-item>
                <el-form-item label="이름" prop="realname">
                    {{form.realname}}
                </el-form-item>
                <el-form-item label="휴대폰 번호" prop="phone">
                    {{form.phone}}
                </el-form-item>
                <el-form-item label="성별" prop="sex">
                    {{form.sex}}
                </el-form-item>
                <el-form-item label="나이" prop="age">
                    {{form.age}}
                </el-form-item>
                <el-form-item label="주소" prop="address">
                    {{form.address}}
                </el-form-item>
                <el-form-item label="가입일" prop="age">
                    {{form.createTime}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">닫기</el-button>
            </span>
        </el-dialog>

        <!-- 정보 수정 -->
        <el-dialog
            title="정보 수정"
            :visible.sync="eformVisible"
            width="40%"
            :before-close="handleClose2">
            <el-form ref="ruleForm" :model="eform" :rules="rules" label-width="120px">
                <el-form-item label="프로필 사진" prop="image">
                    <el-upload
                        class="avatar-uploader"
                        action="mty"
                        :show-file-list="false"
                        :http-request="httpRequest">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input type="hidden" v-model="eform.image"></el-input>
                </el-form-item>
                <el-form-item label="휴대폰 번호" prop="phone">
                    <el-input v-model="eform.phone"></el-input>
                </el-form-item>
                <el-form-item label="이름" prop="realname">
                    <el-input v-model="eform.realname"></el-input>
                </el-form-item>
                <el-form-item label="성별" prop="sex">
                    <el-select v-model="eform.sex" placeholder="성별 선택">
                        <el-option label="남" value="남"></el-option>
                        <el-option label="여" value="여"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="나이" prop="age">
                    <el-input v-model="eform.age" type='number' oninput="if(value<0)value=0"></el-input>
                </el-form-item>
                <el-form-item label="주소" prop="address">
                    <el-input v-model="eform.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="eformVisible = false">취소</el-button>
                <el-button type="primary" @click="saveEdit('ruleForm')">확인</el-button>
            </span>
        </el-dialog>

        <!-- 비밀번호 변경 -->
        <el-dialog
            title="비밀번호 변경"
            :visible.sync="pVisible"
            width="40%"
            :before-close="handleClose3">
            <el-form ref="ruleForm" :model="pform" :rules="rules" label-width="120px">
                <el-form-item label="현재 비밀번호" prop="password">
                    <el-input v-model="pform.password"></el-input>
                </el-form-item>
                <el-form-item label="새 비밀번호" prop="newpassword">
                    <el-input v-model="pform.newpassword"></el-input>
                </el-form-item>
                <el-form-item label="비밀번호 확인" prop="repassword">
                    <el-input v-model="pform.repassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pVisible = false">취소</el-button>
                <el-button type="primary" @click="updatePad('ruleForm')">확인</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from './bus';
    import common from "../../../utils/common";
    import { isMobile } from '../../../utils/checkForm'
    export default {
        data() {
            var validateMobile = (rule, value, callback) => {
             if(!value){
                callback();
             } else if (!isMobile(value)) {
                callback(new Error("올바른 휴대폰 번호를 입력하세요"));
             } else {
                callback();
             }
       };
            return {
                collapse: false,
                fullscreen: false,
                name: '로그인되지 않음',
                userType:'',
                userInfo:{},
                message: 2,
                dialogVisible:false,
                form:{},
                eformVisible:false,
                eform:{},
                pVisible:false,
                pform:{},
                imageUrl:'',
                rules: {
                    phone: [
                        { required: true, message: '휴대폰 번호를 입력하세요', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur'},
                    ],
                    realname: [
                        { required: true, message: '이름을 입력하세요', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '성별을 선택하세요', trigger: 'blur' }
                    ],
                    age: [
                        { required: true, message: '나이를 선택하세요', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '비밀번호를 입력하세요', trigger: 'blur' },
                        { min: 6, max: 20, message: '비밀번호 길이는 6~20자여야 합니다', trigger: 'blur' }
                    ],
                    newpassword: [
                        { required: true, message: '새 비밀번호를 입력하세요', trigger: 'blur' },
                        { min: 6, max: 20, message: '비밀번호 길이는 6~20자여야 합니다', trigger: 'blur' }
                    ],
                    repassword: [
                        { required: true, message: '비밀번호 확인을 입력하세요', trigger: 'blur' },
                        { min: 6, max: 20, message: '비밀번호 길이는 6~20자여야 합니다', trigger: 'blur' }
                    ],
                },
            };
        },
        created() {
            this.userInfo = this.common.getUserInfo('userInfo');
            this.userType = this.common.get('type');
            if(this.userInfo==null){
                this.$message.error('로그인이 만료되었습니다. 다시 로그인하세요!');
            }else{
                this.form = this.userInfo;
                this.eform = this.userInfo;
            }
        },
        methods: {
            // 이미지 업로드 기능 구현
            httpRequest(item) {
                const isJPG = item.file.type == 'image/jpeg' || item.file.type == 'image/png' || item.file.type == 'image/jpg';
                const isLt2M = item.file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('이미지는 JPG 또는 PNG 형식만 가능합니다!');
                }
                if (!isLt2M) {
                    this.$message.error('이미지 크기는 2MB를 초과할 수 없습니다!');
                }
                if (isJPG && isLt2M == true) {
                    let App = this;
                    let mf = new FormData();
                    mf.append('file', item.file);
                    this.$axios.post('/api/file/imgUpload',mf).then(res => {
                        if (res.data.code==200) {
                            this.$message.success({
                                title: '알림',
                                message: res.data.msg,
                            });
                            App.imageUrl =res.data.data;
                            App.eform.image = res.data.data;
                        } else {
                            this.$message.error({title: '알림',message: res.data.msg});
                        }
                    });
                }
            },
            handleClose(){ this.dialogVisible = false; },
            handleClose2(){ this.eformVisible = false; },
            handleClose3(){ this.pVisible = false; },
            goIndex(){ this.$router.push('/user/helloHome'); },
            handleCommand(command) {
                if (command == 'loginout') {
                    localStorage.clear();
                    this.$router.push('/');
                }
                if (command == 'query') { this.dialogVisible = true; }
                if (command == 'update') { this.eformVisible = true; this.imageUrl = this.form.image }
                if (command == 'password') { if (this.$refs.ruleForm !== undefined) this.$refs.ruleForm.resetFields(); this.pVisible = true; }
            },
            saveEdit(formName) {
                this.eform.type = this.userType;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/updateUser', this.eform).then(res => {
                            if(res.data.code == 200){
                                this.$message.success("수정 성공");
                                localStorage.removeItem("userInfo");
                                localStorage.removeItem("token");
                                this.common.set('userInfo',JSON.stringify(res.data.data));
                                this.common.set('token',res.data.data.token);
                                this.eformVisible = false;
                            }else{
                                this.$message.warning(res.msg);
                            }
                        })
                    } else { console.log('error submit!!'); return false; }
                });
            },
            updatePad(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.pform.password != this.userInfo.password){
                            this.$message.warning("현재 비밀번호가 틀렸습니다");
                            return;
                        }
                        if(this.pform.newpassword != this.pform.repassword){
                            this.$message.warning("비밀번호가 일치하지 않습니다");
                            return;
                        }
                        this.pVisible = false;
                        this.pform.id = this.userInfo.id;
                        this.pform.password = this.pform.newpassword;
                        this.pform.type = this.userType;
                        this.$axios.post('/api/updateUser', this.pform).then(res => {
                            if(res.data.code == 200){
                                this.$message.success("수정 성공");
                                localStorage.removeItem("userInfo");
                                localStorage.removeItem("token");
                                this.common.set('userInfo',JSON.stringify(res.data.data));
                                this.common.set('token',res.data.data.token);
                            }else{ this.$message.warning(res.msg); }
                        })
                    } else { console.log('error submit!!'); return false; }
                });
            },
            // 사이드바 접기
            collapseChage() { this.collapse = !this.collapse; bus.$emit('collapse', this.collapse); },
        },
        mounted() {
            if (document.body.clientWidth < 1500) { this.collapseChage(); }
        }
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 46px;
        font-size: 22px;
        color: #fff;
        background-color: #f3c3cc;
    }

    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }

    .header .logo {
        float: left;
        width: 250px;
        line-height: 50px;
        font-size: 16px;
    }

    .header-right {
        float: right;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        height: 48px;
        align-items: center;
    }
    .collapse-btn:hover{
        background: rgb(18 98 219);
    }
    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .btn-bell,
    .btn-fullscreen {
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }

    .btn-bell-badge {
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-name {
        margin-left: 10px;
    }

    .user-avator {
        margin-left: 20px;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #f3c3cc;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100% !important;
        height: 178px;
        display: block;
    }

    .video-js .vjs-icon-placeholder {
        width: 80%;
        height: 80%;
        display: block;
    }

    ::v-deep .el-upload--text{
        width: 100px !important;
        height: 100px !important;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px !important;
        height: 100px;
        display: block;
    }
</style>
