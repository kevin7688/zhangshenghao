<template>
    <div class="">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 탭 옵션 카드</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <el-tabs v-model="message">
          <el-tab-pane :label="`읽지 않은 메시지(${unread.length})`" name="first">
            <el-table :data="unread" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="180"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleRead(scope.$index)">읽음으로 표시</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="handle-row">
              <el-button type="primary">모두 읽음으로 표시</el-button>
            </div>
          </el-tab-pane>
  
          <el-tab-pane :label="`읽은 메시지(${read.length})`" name="second">
            <template v-if="message === 'second'">
              <el-table :data="read" :show-header="false" style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <span class="message-title">{{scope.row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="date" width="150"></el-table-column>
                <el-table-column width="120">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="handleDel(scope.$index)">삭제</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="handle-row">
                <el-button type="danger">전체 삭제</el-button>
              </div>
            </template>
          </el-tab-pane>
  
          <el-tab-pane :label="`휴지통(${recycle.length})`" name="third">
            <template v-if="message === 'third'">
              <el-table :data="recycle" :show-header="false" style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <span class="message-title">{{scope.row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="date" width="150"></el-table-column>
                <el-table-column width="120">
                  <template slot-scope="scope">
                    <el-button @click="handleRestore(scope.$index)">복원</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="handle-row">
                <el-button type="danger">휴지통 비우기</el-button>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'tabs',
    data() {
      return {
        message: 'first',
        showHeader: false,
        unread: [
          {
            date: '2018-04-19 20:00:00',
            title: '【시스템 알림】시스템이 오늘 새벽 2시부터 5시까지 업그레이드됩니다.',
          },
          {
            date: '2018-04-19 21:00:00',
            title: '오늘 밤 12시에 큰 선물 이벤트! 선착순 참여하세요!',
          },
        ],
        read: [
          {
            date: '2018-04-19 20:00:00',
            title: '【시스템 알림】시스템이 오늘 새벽 2시부터 5시까지 업그레이드됩니다.',
          },
        ],
        recycle: [
          {
            date: '2018-04-19 20:00:00',
            title: '【시스템 알림】시스템이 오늘 새벽 2시부터 5시까지 업그레이드됩니다.',
          },
        ],
      };
    },
    methods: {
      // 읽음으로 표시
      handleRead(index) {
        const item = this.unread.splice(index, 1);
        console.log(item);
        this.read = item.concat(this.read);
      },
      // 삭제 후 휴지통으로 이동
      handleDel(index) {
        const item = this.read.splice(index, 1);
        this.recycle = item.concat(this.recycle);
      },
      // 휴지통에서 복원
      handleRestore(index) {
        const item = this.recycle.splice(index, 1);
        this.read = item.concat(this.read);
      },
    },
    computed: {
      unreadNum() {
        return this.unread.length;
      },
    },
  };
  </script>
  

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

