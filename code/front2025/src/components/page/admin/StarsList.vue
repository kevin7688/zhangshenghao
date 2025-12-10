<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.forumTitle" placeholder="제목을 입력하세요" class="handle-input mr10"></el-input>
         <el-button type="primary" icon="el-icon-search" @click="getData">검색</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="forumTitle" label="제목" align="center">
          <template slot-scope="scope">
                <router-link :to="{path:'/user/forum/post/'+scope.row.fid }">
                    <span style="color: #1e8eee;">{{scope.row.forumTitle}}</span>
                </router-link>
            </template>
        </el-table-column>
        <el-table-column prop="realname" label="사용자" align="center"></el-table-column>
        <el-table-column prop="createTime" label="즐겨찾기 시간" align="center"></el-table-column>
        <el-table-column label="작업" align="center" width="260">
          <template slot-scope="scope">
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
  </div>
</template>

<script>
export default {
  name: "Stars",
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
            forumTitle: this.query.forumTitle,
            uid: this.type==='02'?this.userInfo.id:'',
            pagesize: this.pagesize,
            currentPage: this.currentPage,
        };
        this.$axios.post('/api/stars/selectPage',param).then(res => {
            if(res.data.code == 200){
                this.tableData = res.data.data.list;
                this.totalCount = res.data.data.total;
            } else {
                this.$message.warning(res.data.msg);
            }
        });
    },
    handleDelete(index, row) {
        this.$confirm('삭제하시겠습니까?', '알림', {
           type: 'warning'
        }).then(() => {
             this.$axios.get('/api/stars/deleteById?id='+row.id).then(res => {
                if(res.data.code == 200){
                    this.$message.success(res.data.msg);
                    this.tableData.splice(index, 1);
                    this.getData();
            }else{
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