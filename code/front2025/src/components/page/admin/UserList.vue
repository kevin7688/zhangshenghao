<template>
    <div>
      <div class="container">
        <div class="handle-box">
          <el-input v-model="query.phone" placeholder="휴대폰 번호를 입력하세요" class="handle-input mr10"></el-input>
          <el-input v-model="query.realname" placeholder="이름을 입력하세요" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="getData">조회</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">추가</el-button>
        </div>
  
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="image" label="프로필" align="center">
            <template slot-scope="scope">
              <img style="width: 60px;" :src="scope.row.image" />
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="휴대폰 번호" align="center"></el-table-column>
          <el-table-column prop="password" label="비밀번호" align="center"></el-table-column>
          <el-table-column prop="realname" label="이름" align="center"></el-table-column>
          <el-table-column prop="sex" label="성별" align="center"></el-table-column>
          <el-table-column prop="age" label="나이" align="center"></el-table-column>
          <el-table-column prop="address" label="주소" align="center"></el-table-column>
          <el-table-column prop="createTime" label="등록일" align="center"></el-table-column>
          <el-table-column label="작업" align="center" width="260">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">수정</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)">삭제</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div align="center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
  
      <!-- 팝업창 -->
      <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="35%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="90px">
          <el-form-item label="프로필" prop="image">
            <el-upload class="avatar-uploader" action="mty" :show-file-list="false" :http-request="httpRequest">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input type="hidden" v-model="form.image"></el-input>
          </el-form-item>
  
          <el-form-item label="휴대폰 번호" prop="phone">
            <el-input v-model="form.phone" placeholder="휴대폰 번호"></el-input>
          </el-form-item>
  
          <el-form-item label="비밀번호" prop="password">
            <el-input v-model="form.password" placeholder="비밀번호"></el-input>
          </el-form-item>
  
          <el-form-item label="이름" prop="realname">
            <el-input v-model="form.realname" placeholder="이름"></el-input>
          </el-form-item>
  
          <el-form-item label="성별" prop="sex">
            <el-select v-model="form.sex" clearable placeholder="성별 선택">
              <el-option label="남자" value="남자"></el-option>
              <el-option label="여자" value="여자"></el-option>
            </el-select>
          </el-form-item>
  
          <el-form-item label="나이" prop="age">
            <el-input type="number" oninput="if(value<0)value=0" v-model="form.age" placeholder="나이"></el-input>
          </el-form-item>
  
          <el-form-item label="주소" prop="address">
            <el-input type="textarea" rows="5" v-model="form.address" placeholder="주소"></el-input>
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="save('ruleForm')">확인</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { isMobile, isIntNumer } from '../../../utils/checkForm'
  
  export default {
    name: "User",
    data() {
      var validateMobile = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (!isMobile(value)) {
          callback(new Error("올바른 휴대폰 번호를 입력하세요."));
        } else {
          callback();
        }
      };
      var validateIntNumber = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (!isIntNumer(value)) {
          callback(new Error("정수를 입력하세요."));
        } else {
          callback();
        }
      };
      return {
        query: {},
        dialogName: '',
        tableData: [],
        currentPage: 1,
        pagesize: 10,
        totalCount: 0,
        imageUrl: null,
        fileUrl: null,
        dialogVisible: false,
        form: {},
        rules: {
          image: [
            { required: true, message: '프로필 이미지를 업로드하세요.', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '휴대폰 번호를 입력하세요.', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' },
          ],
          password: [
            { required: true, message: '비밀번호를 입력하세요.', trigger: 'blur' },
          ],
          realname: [
            { required: true, message: '이름을 입력하세요.', trigger: 'blur' },
          ],
          sex: [
            { required: true, message: '성별을 선택하세요.', trigger: 'blur' },
          ],
          age: [
            { required: true, message: '나이를 입력하세요.', trigger: 'blur' },
            { validator: validateIntNumber, trigger: 'blur' },
          ],
          address: [
            { required: true, message: '주소를 입력하세요.', trigger: 'blur' },
          ],
        },
        type: '',
        userInfo: {},
      };
    },
    created() {
      this.type = this.common.get('type');
      this.userInfo = this.common.getUserInfo('userInfo');
      if (this.userInfo === null) {
        this.$router.push('/');
      }
      this.getData();
    },
    methods: {
      // 이미지 업로드
      httpRequest(item) {
        const isJPG = item.file.type == 'image/jpeg' || item.file.type == 'image/png' || item.file.type == 'image/jpg';
        const isLt2M = item.file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('이미지는 JPG 또는 PNG 형식만 가능합니다.');
        }
        if (!isLt2M) {
          this.$message.error('이미지 크기는 2MB 이하만 가능합니다.');
        }
        if (isJPG && isLt2M == true) {
          let App = this;
          let mf = new FormData();
          mf.append('file', item.file);
          this.$axios.post('/api/file/imgUpload', mf).then(res => {
            if (res.data.code == 200) {
              this.$message.success({
                title: '안내:',
                message: res.data.msg,
              });
              App.imageUrl = res.data.data;
              App.form.image = res.data.data;
            } else {
              this.$message.error({ title: '안내:', message: res.data.msg });
            }
          });
        }
      },
      handleSizeChange(val) {
        this.pagesize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      // 데이터 조회
      getData() {
        var param = {
          phone: this.query.phone,
          realname: this.query.realname,
          pagesize: this.pagesize,
          currentPage: this.currentPage,
        };
        this.$axios.post('/api/user/selectPage', param).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.list;
            this.totalCount = res.data.data.total;
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      // 수정
      handleEdit(index, row) {
        this.form = JSON.parse(JSON.stringify(row));
        this.imageUrl = row.image;
        this.dialogVisible = true;
        this.$refs['ruleForm'].clearValidate();
        this.dialogName = "사용자 수정";
      },
      // 추가
      handleAdd() {
        if (this.$refs.rulform !== undefined) this.$refs.rulform.resetFields();
        this.dialogVisible = true;
        this.imageUrl = '';
        this.form = {};
        this.$refs['ruleForm'].clearValidate();
        this.dialogName = "사용자 추가";
      },
      // 저장
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.form.id ? '/api/user/edit' : '/api/user/add', this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.dialogVisible = false;
                this.getData();
              } else {
                this.$message.warning(res.data.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 삭제
      handleDelete(index, row) {
        this.$confirm('정말로 삭제하시겠습니까?', '확인', {
          type: 'warning'
        }).then(() => {
          this.$axios.get('/api/user/deleteById?id=' + row.id).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.tableData.splice(index, 1);
              this.getData();
            } else {
              this.$message.warning(res.data.msg);
            }
          });
        }).catch(() => { })
      },
    }
  }
  </script>
  

<style scoped>
    .handle-box {
         margin-bottom: 20px;
     }
    .handle-input {
         width: 300px;
         display: inline-block;
     }
    .table {
         width: 100%;
         font-size: 14px;
     }
    .mr10 {
         margin-right: 10px;
     }
    .table-td-thumb {
         display: block;
         margin: auto;
         width: 40px;
         height: 40px;
     }
    .avatar-uploader .el-upload {
         border: 1px dashed #d9d9d9;
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
     }
    .avatar-uploader .el-upload:hover {
         border-color: #eeab1e;
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