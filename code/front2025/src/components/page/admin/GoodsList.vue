<template>
    <div>
      <div class="container">
        <div class="handle-box">
           <el-select class="handle-input mr10" clearable v-model="query.cid" placeholder="선택하세요">
               <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
           </el-select>
           <el-input v-model="query.name" placeholder="이름 선택" class="handle-input mr10"></el-input>
           <el-button type="primary" icon="el-icon-search" @click="getData">조회</el-button>
           <el-button type="primary" icon="el-icon-plus" @click="handleAdd">추가</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="분류 이름" align="center"></el-table-column>
          <el-table-column prop="image" label="상품 이미지" align="center">
              <template slot-scope="scope">
                  <img style="width: 60px;" :src="scope.row.image" />
              </template>
          </el-table-column>
          <el-table-column prop="name" label="상품 이름" align="center"></el-table-column>
          <el-table-column prop="remark" label="소개" align="center"></el-table-column>
          <el-table-column prop="money" label="가격" align="center"></el-table-column>
          <el-table-column prop="num" label="재고" align="center"></el-table-column>
          <el-table-column prop="status" label="상태" align="center">
              <template slot-scope="scope">
                  <el-button  type="success" size="mini" v-if="scope.row.status == '已发布'">게시됨</el-button>
                  <el-button  type="success" size="mini" v-if="scope.row.status == '已下架'">판매중지</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="게시 시간" align="center"></el-table-column>
          <el-table-column label="작업" align="center" width="260" >
            <template slot-scope="scope">
              <el-button  type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">편집</el-button>
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
      <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="55%">
          <el-form ref="ruleForm" :model="form" :rules="rules" label-width="90px">
          <el-form-item label="분류" prop="cid">
              <el-select v-model="form.cid" clearable placeholder="선택하세요">
                  <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="상품 이미지" prop="image">
              <el-upload class="avatar-uploader" action="mty" :show-file-list="false" :http-request="httpRequest">
                   <img v-if="imageUrl" :src="imageUrl" class="avatar">
                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-input type="hidden" v-model="form.image"></el-input>
          </el-form-item>
          <el-form-item label="상품 이름" prop="name">
              <el-input v-model="form.name" placeholder="상품 이름"></el-input>
          </el-form-item>
          <el-form-item label="소개" prop="remark">
              <el-input v-model="form.remark" placeholder="소개"></el-input>
          </el-form-item>
          <el-form-item label="가격" prop="money">
              <el-input v-model="form.money" placeholder="가격"></el-input>
          </el-form-item>
          <el-form-item label="재고" prop="num">
              <el-input type='number' oninput="if(value<0)value=0" v-model="form.num" placeholder="재고"></el-input>
          </el-form-item>
          <el-form-item label="상태" prop="status">
              <el-select v-model="form.status" clearable placeholder="상태">
              <el-option label="게시됨" value="已发布"></el-option>
              <el-option label="판매중지" value="已下架"></el-option>
              </el-select>
          </el-form-item>
           <el-card style="height: 610px;">
              <quill-editor v-model="form.content" ref="myQuillEditor" style="height: 500px;" :options="editorOption"></quill-editor>
           </el-card>
        </el-form>
         <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="save('ruleForm')">확인</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { quillEditor, Quill } from 'vue-quill-editor'
  import { container, ImageExtend, QuillWatch } from "quill-image-super-solution-module";
  Quill.register("modules/ImageExtend", ImageExtend);
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { isIntNumer,isMoney } from '../../../utils/checkForm'
  
  export default {
    name: "Goods",
    components: {
       quillEditor
    },
    data() {
        var validateIntNumber = (rule, value, callback) => {
               if(!value){
                  callback();
               } else if (!isIntNumer(value)) {
                  callback(new Error("정수를 입력하세요"));
               } else {
                  callback();
               }
         };
        var validateMoney = (rule, value, callback) => {
               if(!value){
                  callback();
               } else if (!isMoney(value)) {
                  callback(new Error("올바른 금액을 입력하세요"));
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
            cid: [
                { required: true, message: '분류를 입력하세요', trigger: 'blur' },
            ],
            image: [
                { required: true, message: '상품 이미지를 입력하세요', trigger: 'blur' },
            ],
            name: [
                { required: true, message: '상품 이름을 입력하세요', trigger: 'blur' },
            ],
            remark: [
                { required: true, message: '소개를 입력하세요', trigger: 'blur' },
            ],
            money: [
                { required: true, message: '가격을 입력하세요', trigger: 'blur' },
                { validator: validateMoney, trigger: 'blur'},
            ],
            num: [
                { required: true, message: '재고를 입력하세요', trigger: 'blur' },
                { validator: validateIntNumber, trigger: 'blur'},
            ],
            content: [
                { required: true, message: '상품 소개를 입력하세요', trigger: 'blur' },
            ],
            status: [
                { required: true, message: '상태를 입력하세요', trigger: 'blur' },
            ],
          },
          editorOption: {
             modules: {
                ImageExtend: {
                    name: "file",
                    action: "/api/file/imgUpload",
                    accept: "image/jpg, image/png, image/gif, image/jpeg, image/bmp, image/x-icon",
                    response: (res) => {
                       return res.data;
                    }
                },
                toolbar: {
                    container: container,
                    handlers: {
                        image: function() {
                             QuillWatch.emit(this.quill.id);
                        },
                     },
                 },
             },
           },
          categoryList:[],
          type:'',
          userInfo:{},
      };
    },
    created() {
        this.type = this.common.get('type');
        this.userInfo = this.common.getUserInfo('userInfo');
        if(this.userInfo===null){
           this.$router.push('/');
        }
        this.getData();
        this.querycategory()
    },
    methods: {
      querycategory(){
          this.categoryList = [];
          this.$axios.post('/api/category/queryAll',{}).then(res => {
              for(var i in res.data.data){
                 this.categoryList.push({id:res.data.data[i].id+'',name:res.data.data[i].name});
              }
           });
       },
      httpRequest(item) {
          const isJPG = item.file.type == 'image/jpeg' || item.file.type == 'image/png' || item.file.type == 'image/jpg';
          const isLt2M = item.file.size / 1024 / 1024 < 2;
          if (!isJPG) {
               this.$message.error('JPG 또는 PNG 형식만 업로드 가능합니다!');
          }
          if (!isLt2M) {
               this.$message.error('업로드 파일 크기는 2MB를 초과할 수 없습니다!');
          }
          if (isJPG && isLt2M == true) {
              let App = this;
              let mf = new FormData();
              mf.append('file', item.file);
              this.$axios.post('/api/file/imgUpload',mf).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success({
                            title: '알림',
                            message: res.data.msg,
                        });
                        App.imageUrl =res.data.data;
                        App.form.image = res.data.data;
                    } else {
                        this.$message.error({title: '알림',message: res.data.msg});
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
      getData() {
          var param = {
              cid: this.query.cid, 
              name: this.query.name, 
              pagesize: this.pagesize,
              currentPage: this.currentPage,
          };
          this.$axios.post('/api/goods/selectPage',param).then(res => {
              if(res.data.code == 200){
                  this.tableData = res.data.data.list;
                  this.totalCount = res.data.data.total;
              } else {
                  this.$message.warning(res.data.msg);
              }
          });
      },
      handleEdit(index, row) {
          this.form = JSON.parse(JSON.stringify(row));
          this.imageUrl = row.image;
          this.querycategory();
          this.form.cid = this.form.cid+'';
          this.dialogVisible = true;
          this.$refs['ruleForm'].clearValidate();
          this.dialogName = "상품 편집";
      },
      handleAdd() {
          if (this.$refs.rulform !== undefined) this.$refs.rulform.resetFields();
          this.dialogVisible = true;
          this.imageUrl = '';
          this.querycategory();
          this.form = {};
          this.form.status='已发布';
          this.$refs['ruleForm'].clearValidate();
          this.dialogName = "상품 추가";
      },
      save(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$axios.post(this.form.id?'/api/goods/edit' : '/api/goods/add', this.form).then(res => {
                if(res.data.code == 200){
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
      handleDelete(index, row) {
          this.$confirm('삭제하시겠습니까?', '알림', { type: 'warning' })
          .then(() => {
               this.$axios.get('/api/goods/deleteById?id='+row.id).then(res => {
                  if(res.data.code == 200){
                      this.currentPage = 1
                      this.getData();
              }else{
                this.$message.warning(res.data.msg);
              }
            });
          }).catch(() => {})
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