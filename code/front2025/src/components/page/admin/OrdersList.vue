<template>
    <div>
      <div class="container">
        <div class="handle-box">
           <el-input v-model="query.no" placeholder="주문 번호 선택" class="handle-input mr10"></el-input>
           <el-button type="primary" icon="el-icon-search" @click="getData">검색</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="no" label="주문 번호" align="center"></el-table-column>
          <el-table-column prop="num" label="상품 수량" align="center">
              <template slot-scope="scope">
                  {{scope.row.num}}개
              </template>
          </el-table-column>
          <el-table-column prop="total" label="총액" align="center">
              <template slot-scope="scope">
                  {{scope.row.total}}원
              </template>
          </el-table-column>
          <el-table-column prop="realname" label="사용자" align="center"></el-table-column>
          <el-table-column prop="phone" label="휴대폰 번호" align="center"></el-table-column>
          <el-table-column prop="address" label="주소" align="center"></el-table-column>
          <el-table-column prop="remark" label="비고" align="center"></el-table-column>
          <el-table-column prop="status" label="상태" align="center">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" v-if="scope.row.status == '01'">결제 대기</el-button>
                  <el-button type="success" size="mini" v-if="scope.row.status == '02'">배송 준비</el-button>
                  <el-button type="warning" size="mini" v-if="scope.row.status == '03'">배송 중</el-button>
                  <el-button type="danger" size="mini" v-if="scope.row.status == '04'">완료</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="주문 시간" align="center" width="170"></el-table-column>
          <el-table-column label="작업" align="center" width="260" >
            <template slot-scope="scope">
              <el-button type="warning" icon="el-icon-check" v-if="type==='02' && scope.row.status === '01'" @click="shenpi(scope.row,'02')">결제</el-button>
              <el-button type="warning" icon="el-icon-upload2" v-if="type==='01' && scope.row.status === '02'" @click="shenpi(scope.row,'03')">배송</el-button>
              <el-button type="warning" icon="el-icon-download" v-if="type==='02' && scope.row.status === '03'" @click="shenpi(scope.row,'04')">수령</el-button>
              <el-button type="primary" icon="el-icon-zoom-in" @click="detail(scope.$index, scope.row)">상세</el-button>
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
  
      <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="35%">
          <el-form ref="ruleForm" :model="form" label-width="90px">
          <el-form-item label="댓글 내용" prop="content">
              <el-input v-model="form.content" type="textarea" rows="3" placeholder="댓글 내용"></el-input>
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">취소</el-button>
          <el-button type="primary" @click="save('ruleForm')">확인</el-button>
        </span>
      </el-dialog>
  
      <el-dialog title="주문 상세" :visible.sync="dialogTableVisible">
          <el-table :data="orderItemData">
              <el-table-column property="gname" label="상품 이름">
                  <template slot-scope="scope">
                      <router-link :to="{path:'/user/shop/product/'+scope.row.gid }">
                          <span style="color: #1e8eee;">{{scope.row.goodsName}}</span>
                      </router-link>
                  </template>
              </el-table-column>
              <el-table-column property="num" label="수량" ></el-table-column>
              <el-table-column property="money" label="가격(원)" ></el-table-column>
              <el-table-column label="작업" align="center" width="260" >
              <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-s-promotion" v-if="type==='02' && scope.row.status === '04'" @click="comment(scope.row)">댓글</el-button>
              </template>
              </el-table-column>
          </el-table>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { isIntNumer,isMoney } from '../../../utils/checkForm'
  export default {
    name: "Orders",
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
          type:'',
          userInfo:{},
          dialogTableVisible:false,
          orderItemData:[],
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
              no: this.query.no, 
              uid: this.type==='02'?this.userInfo.id:'',
              pagesize: this.pagesize,
              currentPage: this.currentPage,
          };
          this.$axios.post('/api/orders/selectPage',param).then(res => {
              if(res.data.code == 200){
                  this.tableData = res.data.data.list;
                  this.totalCount = res.data.data.total;
              } else {
                  this.$message.warning(res.data.msg);
              }
          });
      },
      detail(index, row){
            var param = {
                currentPage: 1,
                pagesize: 999,
                oid: row.id
            };
            this.$axios.post('/api/orderItem/queryAll',param).then(res => {
                this.orderItemData = res.data.data;
                this.dialogTableVisible = true;
            });
        },
      comment(row) {
          this.form = JSON.parse(JSON.stringify(row));
          this.dialogVisible = true;
          this.form.gid = row.gid;
          this.form.uid = this.userInfo.id;
          this.dialogName = "상품 댓글";
      },
      save(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$axios.post('/api/review/add', this.form).then(res => {
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
               this.$axios.get('/api/orders/deleteById?id='+row.id).then(res => {
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
      shenpi(row,status){
          this.$confirm('확인하시겠습니까?', '알림', {
              type: 'warning'
          }).then(() => {
              this.$axios.post('/api/orders/edit',{"id":row.id,"status": status}).then(res => {
                  if(res.data.code === 200){
                      this.getData();
                      this.$message.success("작업 성공");
                  }else{
                      this.$message.warning("작업 실패");
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