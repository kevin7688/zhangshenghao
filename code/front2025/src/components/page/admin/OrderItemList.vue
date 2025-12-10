<template>
  <div>
    <div class="container">
      <div class="handle-box">
         <el-input v-model="query.oid" placeholder="주문 선택" class="handle-input mr10"></el-input>
         <el-button type="primary" icon="el-icon-search" @click="getData">검색</el-button>
         <el-button type="primary" icon="el-icon-plus" @click="handleAdd">추가</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="ordersNo" label="주문 번호" align="center"></el-table-column>
        <el-table-column prop="goodsName" label="상품명" align="center"></el-table-column>
        <el-table-column prop="num" label="수량" align="center"></el-table-column>
        <el-table-column prop="money" label="금액" align="center"></el-table-column>
        <el-table-column prop="createTime" label="생성 시간" align="center"></el-table-column>
        <el-table-column label="작업" align="center" width="260" >
          <template slot-scope="scope">
            <el-button  type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">수정</el-button>
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
        <el-form-item label="주문" prop="oid">
            <el-input v-model="form.oid" placeholder="주문"></el-input>
        </el-form-item>
        <el-form-item label="상품" prop="gid">
            <el-input v-model="form.gid" placeholder="상품"></el-input>
        </el-form-item>
        <el-form-item label="수량" prop="num">
            <el-input type='number' oninput="if(value<0)value=0" v-model="form.num" placeholder="수량"></el-input>
        </el-form-item>
        <el-form-item label="금액" prop="money">
            <el-input v-model="form.money" placeholder="금액"></el-input>
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
import { isIntNumer,isMoney } from '../../../utils/checkForm'
export default {
  name: "OrderItem",
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
        dialogVisible: false,
        form: {},
        rules: {
          oid: [
              { required: true, message: '주문을 입력하세요', trigger: 'blur' },
          ],
          gid: [
              { required: true, message: '상품을 입력하세요', trigger: 'blur' },
          ],
          num: [
              { required: true, message: '수량을 입력하세요', trigger: 'blur' },
              { validator: validateIntNumber, trigger: 'blur'},
          ],
          money: [
              { required: true, message: '금액을 입력하세요', trigger: 'blur' },
              { validator: validateMoney, trigger: 'blur'},
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
            oid: this.query.oid, 
            pagesize: this.pagesize,
            currentPage: this.currentPage,
        };
        this.$axios.post('/api/order_item/selectPage',param).then(res => {
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
        this.dialogName = "주문 항목 수정";
    },
    handleAdd() {
        if (this.$refs.rulform !== undefined) this.$refs.rulform.resetFields();
        this.dialogVisible = true;
        this.form = {};
        this.$refs['ruleForm'].clearValidate();
        this.dialogName = "주문 항목 추가";
    },
    save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.form.id?'/api/orderItem/edit' : '/api/orderItem/add', this.form).then(res => {
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
        this.$confirm('정말 삭제하시겠습니까?', '알림', {
           type: 'warning'
        }).then(() => {
             this.$axios.get('/api/orderItem/deleteById?id='+row.id).then(res => {
                if(res.data.code == 200){
                    this.$message.success(res.data.msg);
                    this.tableData.splice(index, 1);
                    this.getData();
                }else{
                  this.$message.warning(res.data.msg);
                }
          });
        }).catch(() => {});
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