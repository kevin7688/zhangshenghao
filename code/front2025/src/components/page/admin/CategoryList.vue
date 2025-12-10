<template>
  <div>
    <div class="container">
      <div class="handle-box">
         <el-input v-model="query.name" placeholder="카테고리 이름 선택" class="handle-input mr10"></el-input>
         <el-button type="primary" icon="el-icon-search" @click="getData">조회</el-button>
         <el-button type="primary" icon="el-icon-plus" @click="handleAdd">추가</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="카테고리 이름" align="center"></el-table-column>
        <el-table-column prop="remark" label="설명" align="center"></el-table-column>
        <el-table-column prop="createTime" label="등록 시간" align="center"></el-table-column>
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
    <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="35%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="카테고리 이름" prop="name">
            <el-input v-model="form.name" placeholder="카테고리 이름"></el-input>
        </el-form-item>
        <el-form-item label="설명" prop="remark">
            <el-input type="textarea" rows="5" v-model="form.remark" placeholder="설명"></el-input>
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
export default {
  name: "Category",
  data() {
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
          name: [
              { required: true, message: '카테고리 이름을 입력하세요', trigger: 'blur' },
          ],
          remark: [
              { required: true, message: '설명을 입력하세요', trigger: 'blur' },
          ],
        },
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
  },
  methods: {
    handleSizeChange: function(val) {
        this.pagesize = val;
        this.getData();
    },
    handleCurrentChange: function(val) {
        this.currentPage = val;
        this.getData();
    },
    getData() {
        var param = {
            name: this.query.name, 
            pagesize: this.pagesize,
            currentPage: this.currentPage,
        };
        this.$axios.post('/api/category/selectPage',param).then(res => {
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
        this.dialogVisible = true;
        this.$refs['ruleForm'].clearValidate();
        this.dialogName = "카테고리 편집";
    },
    handleAdd() {
        if (this.$refs.rulform !== undefined) this.$refs.rulform.resetFields();
        this.dialogVisible = true;
        this.form = {};
        this.$refs['ruleForm'].clearValidate();
        this.dialogName = "카테고리 추가";
    },
    save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.form.id?'/api/category/edit' : '/api/category/add', this.form).then(res => {
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
        this.$confirm('삭제하시겠습니까?', '알림', {
           type: 'warning'
        }).then(() => {
             this.$axios.get('/api/category/deleteById?id='+row.id).then(res => {
                if(res.data.code == 200){
                    this.$message.success(res.data.msg);
                    this.tableData.splice(index, 1);
                    this.getData();
                } else {
                    this.$message.warning(res.data.msg);
                }
          });
        }).catch(() => {
        })
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