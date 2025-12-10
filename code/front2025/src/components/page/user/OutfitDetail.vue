<template>
  <div class="page-container">
    <div class="outfit-detail-container">
      <!-- 주요 내용 영역 -->
      <div class="main-content">
        <!-- 이미지 영역 -->
        <div class="image-section">
          <img :src="outfitDetail.images" :alt="outfitDetail.title" class="outfit-image">
        </div>

        <!-- 작성자 정보 -->
        <div class="author-section">
          <div class="author-info">
            <img :src="outfitDetail.userImage" :alt="outfitDetail.realname" class="author-avatar">
            <div class="author-text">
              <h3>{{ outfitDetail.realname }}</h3>
              <span class="publish-time">{{ outfitDetail.createTime }}</span>
            </div>
          </div>
        </div>

        <!-- 코디 상세 정보 -->
        <div class="detail-section">
          <h1 class="outfit-title">{{ outfitDetail.name }}</h1>
          <div class="interaction-bar">
            <span class="views"><i class="el-icon-view"></i> {{ outfitDetail.num }}</span>
            <span class="shares"><i class="el-icon-share"></i> 공유</span>
          </div>
          <div class="outfit-description">
            <p v-html="outfitDetail.content"></p>
          </div>
        </div>

        <!-- 댓글 영역 -->
        <div class="comments-section">
          <h3>댓글 ({{ outfitDetail.discusses.length }})</h3>
          <!-- 댓글 입력 -->
          <div class="comment-input">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="댓글을 작성하세요..."
              v-model="newComment">
            </el-input>
            <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
              댓글 등록
            </el-button>
          </div>

          <!-- 댓글 목록 -->
          <div class="comments-list" v-if="outfitDetail.discusses">
            <div v-for="comment in outfitDetail.discusses" :key="comment.id" class="comment-item">
              <img :src="comment.userImage" :alt="comment.realname" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-user">{{ comment.realname }}</span>
                  <span class="comment-time">{{ comment.createTime }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions" style="margin-left: 20px;">
                  <span v-if="comment.reply!=null">답글: {{ comment.reply }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 추천 영역 -->
      <div class="recommend-section">
        <h3>추천 코디</h3>
        <div class="recommend-list" style="margin-top: 14px;">
          <div v-for="item in recommendations" :key="item.id" 
               class="recommend-item" @click="viewOutfit(item.id)">
            <img :src="item.image" :alt="item.title">
            <div class="recommend-info">
              <h4>{{ item.title }}</h4>
              <span>{{ item.comments }} 개의 댓글</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OutfitDetail',
  data() {
    return {
      isFollowing: false,
      isLiked: false,
      newComment: '',
      outfitDetail: {},
      recommendations: [],
      type:'',
      userInfo:{},
      id:'',
    }
  },
  created() {
    this.userInfo = this.common.getUserInfo('userInfo');
    this.type = this.common.get("type");
    this.id = this.$route.params.id
    this.fetchOutfitDetail();
    this.recomment();
  },
  methods: {
    submitComment() {
        if (!this.newComment.trim()) {
          this.$message.warning('댓글 내용을 입력하세요.');
          return;
        }
        if (!this.userInfo) {
          this.$message({
            message: "시스템에 로그인해주세요.",
            type: "warning"
          });
          return;
        }
        if (this.type!=null && this.type!='02') {
          this.$message({
            message: "일반 사용자로 로그인해주세요.",
            type: "warning"
          });
          return;
        }
        // 댓글 등록
        const comment = {
          oid: this.id,
          uid: this.userInfo.id,
          content: this.newComment
        }
        this.$axios.post('/api/discuss/add', comment).then(res => {
            if(res.data.code == 200){
                this.newComment = ''
                this.$message.success('댓글이 등록되었습니다.');
                this.fetchOutfitDetail();
            }else{
                this.$message.warning(res.data.msg);
            }
        })
    },
    viewOutfit(id) {
      this.$router.push(`/user/outfit/${id}`)
    },
    // 상세 데이터 가져오기
    fetchOutfitDetail() {
        this.$axios.get('/api/outfit/frontOne?id='+this.id).then(res => {
            this.outfitDetail = res.data.data;
        });
    },
    // 추천 데이터 가져오기
    recomment() {
        this.$axios.post('/api/outfit/frontRecommend',{}).then(res => {
          this.recommendations = res.data.data;
      });
    }
  }
}
</script>


<style scoped>
.page-container {
  width: 100%;
  min-height: 100%;
  padding: 20px 0;
}

.outfit-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.main-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.image-section {
  width: 100%;
  max-height: 600px;
  overflow: hidden;
}

.outfit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-section {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.publish-time {
  color: #999;
  font-size: 14px;
}

.detail-section {
  padding: 20px;
}

.outfit-title {
  margin-bottom: 15px;
  font-size: 24px;
}

.interaction-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #606266;
}

.interaction-bar span {
  cursor: pointer;
}

.interaction-bar i {
  margin-right: 5px;
}

.outfit-description {
  line-height: 1.6;
  color: #606266;
  margin-bottom: 30px;
}

.items-section {
  margin: 30px 0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.item-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.item-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.item-info {
  padding: 10px;
  text-align: center;
}

.price {
  color: #f56c6c;
  margin: 5px 0 10px;
}

.comments-section {
  padding: 20px;
}

.comment-input {
  margin: 20px 0;
}

.comment-input .el-button {
  margin-top: 10px;
  float: right;
}

.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 5px;
}

.comment-user {
  font-weight: bold;
  margin-right: 10px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-text {
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-actions {
  color: #999;
  font-size: 14px;
}

.comment-actions span {
  margin-right: 15px;
  cursor: pointer;
}

.comment-actions span:hover {
  color: #f3c3cc;
}

.recommend-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: sticky;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.recommend-item {
  margin-bottom: 15px;
  cursor: pointer;
}

.recommend-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.recommend-info {
  padding: 10px 0;
}

.recommend-info h4 {
  margin: 0;
  font-size: 14px;
}

.recommend-info span {
  color: #999;
  font-size: 12px;
}
</style> 