<template>
  <div class="product-detail-container">
    <!-- 상품 주요 정보 영역 -->
    <div class="product-main">
      <!-- 왼쪽 이미지 -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="product.image" :alt="product.name" class="gallery-image">
        </div>
      </div>

      <!-- 오른쪽 상품 정보 -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-meta">
          <div class="price-section">
            <span class="price-label">가격</span>
            <span class="price">¥{{ product.money }}</span>
          </div>
          <div class="sales-info">
            <span>누적 리뷰 {{ product.reviews.length }}</span>
          </div>
        </div>

        <!-- 상품 선택 영역 -->
        <div class="product-options">
          <div class="option-group">
            <div class="option-label">수량</div>
            <div class="option-values">
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="3"
                size="small">
              </el-input-number>
              <span class="stock-info">재고 {{ product.num }} 개</span>
            </div>
          </div>
        </div>

        <!-- 구매 버튼 -->
        <div class="purchase-actions">
          <el-button type="danger" size="large" @click="showBuyDialog = true">즉시 구매</el-button>
          <el-button type="primary" size="large" @click="addToCart">장바구니 담기</el-button>
        </div>

        <!-- 구매 확인 다이얼로그 -->
        <el-dialog
          title="구매 확인"
          :visible.sync="showBuyDialog"
          width="400px"
          :before-close="handleDialogClose">
          <div class="buy-dialog-content">
            <div class="dialog-product-info">
              <img :src="product.image" :alt="product.name" class="dialog-product-image">
              <div class="dialog-product-detail">
                <h4>{{ product.name }}</h4>
                <div class="dialog-product-price">¥{{ product.money }}</div>
                <div class="dialog-product-quantity">
                  수량：{{ quantity }} 개
                </div>
              </div>
            </div>

            <div class="remark-input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="비고를 입력하세요 (선택)"
                v-model="orderRemark"
                maxlength="200"
                show-word-limit>
              </el-input>
            </div>

            <div class="order-amount">
              <span>주문 총액：</span>
              <span class="amount">¥{{ (product.money * quantity).toFixed(2) }}</span>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleDialogClose">취소</el-button>
            <el-button type="primary" @click="confirmBuy" :loading="submitting">
              주문 확인
            </el-button>
          </span>
        </el-dialog>

        <!-- 서비스 약속 -->
        <div class="service-promises">
          <div class="promise-item">
            <i class="el-icon-check"></i>
            <span>정품 보장</span>
          </div>
          <div class="promise-item">
            <i class="el-icon-truck"></i>
            <span>빠른 배송</span>
          </div>
          <div class="promise-item">
            <i class="el-icon-refresh-right"></i>
            <span>7일 무조건 반품</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 상품 상세 및 리뷰 -->
    <div class="product-detail-tabs">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="상품 상세" name="details">
          <div class="details-content">
            <div class="detail-section">
              <h3>상품 설명</h3>
              <p v-html="product.content"></p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="상품 리뷰" name="reviews">
          <div class="reviews-section">
            <div class="reviews-list" v-if="product.reviews.length>0">
              <div v-for="review in product.reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <img :src="review.userImage" :alt="review.realname" class="user-avatar">
                  <span class="user-name">{{ review.realname }}</span>
                </div>
                <div class="review-content">{{ review.content }}</div>
                <div class="review-footer">
                  <span class="review-time">{{ review.createTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      activeTab: 'details',
      selectedColor: '',
      selectedSize: '',
      quantity: 1,
      isFavorite: false,
      currentImageIndex: 0,
      productId:'',
      product: {},
      userInfo: {},
      type:'',
      showBuyDialog: false,
      orderRemark: '',
      submitting: false,
    }
  },
  computed: {
    currentImage() {
      return this.product.images[this.currentImageIndex]
    }
  },
  methods: {
    handleDialogClose() {
      this.showBuyDialog = false
      this.orderRemark = ''
    },
    confirmBuy() {
      if (!this.userInfo) {
        this.$message.warning('로그인 후 이용 가능합니다')
        return
      }
      if (this.type !== '02') {
        this.$message.warning('사용자만 구매 가능합니다')
        return
      }
      if (this.quantity > this.product.num) {
        this.$message.warning('재고 부족')
        return
      }

      this.submitting = true
      this.$axios.post('/api/orderItem/xiadan', {
        gid: this.productId,
        uid: this.userInfo.id,
        num: this.quantity,
        remark: this.orderRemark
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('주문 성공')
          this.showBuyDialog = false
          this.orderRemark = ''
          this.getData()
        } else {
          this.$message.warning(res.data.msg)
        }
      }).finally(() => {
        this.submitting = false
      })
    },
    getData(){
      this.$axios.get('/api/goods/frontOne?id='+this.productId).then(res => {
        this.product = res.data.data;
      });
    },
    addToCart() {
      if (!this.userInfo) {
            this.$message({
            type: 'warning',
            message: '로그인 후 이용 가능합니다'
            })
            return
        }
        if (this.type!=='02') {
            this.$message({
                type: 'warning',
                message: '사용자로 로그인 해주세요'
            })
            return
        }
        if(this.quantity>this.product.num){
            this.$message.warning("재고 부족");
            return;
        }
        this.$axios.post('/api/cart/add', {gid:this.product.id,uid:this.userInfo.id,num:this.quantity}).then(res => {
            if(res.data.code == 200){
                this.$message.success("장바구니 담기 성공");
                this.quantity = 1;
                this.getData()
            }else{
                this.$message.warning("장바구니 담기 실패");
            }
        });
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      this.$message.success(this.isFavorite ? '즐겨찾기 추가' : '즐겨찾기 취소')
    },
    previewImage(image) {},
    selectImage(index) {
      this.currentImageIndex = index
    }
  },
  created() {
    this.userInfo = this.common.getUserInfo('userInfo');
    this.type = this.common.get("type");
    this.productId = this.$route.params.id
    this.getData()
  }
}
</script>


<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 主要信息区域样式 */
.product-main {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 40px;
  margin-bottom: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 30px;
}

/* 左侧图片区域样式 */
.product-gallery {
  display: flex;
  gap: 20px;
}

.main-image {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 右侧信息区域样式 */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 详情和评价区域样式 */
.product-detail-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.thumbnail-item:hover {
  border-color: #f3c3cc;
}

.thumbnail-item.active {
  border-color: #f3c3cc;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 24px;
  margin: 0 0 20px;
}

.product-meta {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.price-section {
  margin-bottom: 15px;
}

.price-label {
  font-size: 14px;
  color: #666;
}

.price {
  font-size: 28px;
  color: #F56C6C;
  margin: 0 10px;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 16px;
}

.sales-info {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.sales-info span {
  display: flex;
  align-items: center;
}

.product-options {
  margin: 5px 0;
}

.option-group {
  margin-bottom: 20px;
}

.option-label {
  margin-bottom: 10px;
  color: #666;
}

.option-values {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stock-info {
  margin-left: 10px;
  color: #666;
}

.purchase-actions {
  margin: 20px 0;
  display: flex;
  gap: 15px;
}

.service-promises {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.promise-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.promise-item i {
  color: #67C23A;
}

.details-content {
  padding: 20px 0;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  margin-bottom: 15px;
}

.parameters-list {
  list-style: none;
  padding: 0;
}

.parameters-list li {
  margin-bottom: 10px;
  display: flex;
}

.param-label {
  width: 100px;
  color: #666;
}

.detail-images img {
  width: 100%;
  margin-bottom: 20px;
}

.reviews-section {
  padding: 20px 0;
}

.reviews-summary {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}

.rating {
  text-align: center;
}

.rating-score {
  font-size: 36px;
  color: #F56C6C;
}

.rating-stars {
  color: #FFBA00;
}

.rating-stars i.active {
  color: #FFBA00;
}

.rating-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.review-rating {
  margin-left: auto;
  color: #FFBA00;
}

.review-content {
  margin: 10px 0;
  line-height: 1.6;
}

.review-images {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.review-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.review-footer {
  color: #999;
  font-size: 12px;
}

.review-time {
  margin-right: 20px;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .product-main {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    justify-content: center;
  }
}

/* 添加购买对话框相关样式 */
.buy-dialog-content {
  padding: 10px 0;
}

.dialog-product-info {
  display: flex;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.dialog-product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.dialog-product-detail {
  flex: 1;
}

.dialog-product-detail h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.dialog-product-price {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.dialog-product-quantity {
  color: #606266;
  font-size: 14px;
}

.remark-input {
  margin-bottom: 20px;
}

.order-amount {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.amount {
  color: #F56C6C;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}
</style> 