<template>
    <div>
      <div class="container">
        <div class="handle-box">
           <el-input v-model="query.name" placeholder="이름 선택" class="handle-input mr10"></el-input>
           <el-button type="primary" icon="el-icon-search" @click="getData">검색</el-button>
           <el-button type="primary" icon="el-icon-plus" @click="handleAdd" v-if="type=='02'">추가</el-button>
        </div>
  
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="image" label="이미지" align="center">
              <template slot-scope="scope">
                  <img style="width: 60px;" :src="scope.row.image" />
              </template>
          </el-table-column>
          <el-table-column prop="type" label="유형" align="center"></el-table-column>
          <el-table-column prop="season" label="계절" align="center"></el-table-column>
          <el-table-column prop="name" label="이름" align="center">
              <template slot-scope="scope">
                  <router-link :to="{path:'/user/outfit/'+scope.row.id }">
                      <span style="color: #1e8eee;">{{scope.row.name}}</span>
                  </router-link>
              </template>
          </el-table-column>
          <el-table-column prop="realname" label="사용자" align="center"></el-table-column>
          <el-table-column prop="num" label="조회수" align="center"></el-table-column>
          <el-table-column prop="status" label="상태" align="center">
              <template slot-scope="scope">
                  <el-button type="success" size="mini" v-if="scope.row.status == '已发布'">게시됨</el-button>
                  <el-button type="warning" size="mini" v-if="scope.row.status == '已撤回'">철회됨</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="게시 시간" align="center"></el-table-column>
          <el-table-column label="작업" align="center" width="260">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">편집</el-button>
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
  
      <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="55%">
          <el-form ref="ruleForm" :model="form" :rules="rules" label-width="90px">
          <el-form-item label="이미지" prop="image">
              <el-upload class="avatar-uploader" action="mty" :show-file-list="false" :http-request="httpRequest">
                   <img v-if="imageUrl" :src="imageUrl" class="avatar">
                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-input type="hidden" v-model="form.image"></el-input>
          </el-form-item>
          <el-form-item label="유형" prop="type">
              <el-select v-model="form.type" clearable placeholder="유형">
              <el-option label="캐주얼" value="休闲"></el-option>
              <el-option label="비즈니스" value="商务"></el-option>
              <el-option label="운동" value="运动"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="계절" prop="season">
              <el-select v-model="form.season" clearable placeholder="계절">
              <el-option label="봄" value="春季"></el-option>
              <el-option label="여름" value="夏季"></el-option>
              <el-option label="가을" value="秋季"></el-option>
              <el-option label="겨울" value="冬季"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="이름" prop="name">
              <el-input v-model="form.name" placeholder="이름"></el-input>
          </el-form-item>
          <el-form-item label="조회수" prop="num">
              <el-input type='number' oninput="if(value<0)value=0" v-model="form.num" placeholder="조회수"></el-input>
          </el-form-item>
          <el-form-item label="상태" prop="status">
              <el-select v-model="form.status" clearable placeholder="상태">
              <el-option label="게시됨" value="已发布"></el-option>
              <el-option label="철회됨" value="已撤回"></el-option>
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