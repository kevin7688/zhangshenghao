<template>
  <div class="cart-container">
    <!-- 장바구니 헤더 -->
    <div class="cart-header">
      <h2>내 장바구니</h2>
      <div class="cart-summary">
        총 <span class="highlight">{{ totalItems }}</span> 개의 상품
      </div>
    </div>

    <!-- 장바구니 본문 -->
    <div class="cart-main" v-if="cartItems.length">
      <!-- 상품 목록 -->
      <div class="cart-list">
        <!-- 표 헤더 -->
        <div class="cart-table-header">
          <el-checkbox 
            v-model="selectAll"
            @change="handleSelectAllChange">
            전체 선택
          </el-checkbox>
          <span style="margin-left: 10px;" class="column-product">상품 정보</span>
          <span class="column-price">단가</span>
          <span class="column-quantity">수량</span>
          <span class="column-total">소계</span>
          <span class="column-action">작업</span>
        </div>

        <!-- 상품 항목 -->
        <div v-for="item in cartItems" 
             :key="item.id" 
             class="cart-item"
             :class="{ 'out-of-stock': item.goodsNum === 0 }">
          <el-checkbox 
            v-model="item.selected"
            :disabled="item.goodsNum === 0"
            @change="handleItemSelectChange">
          </el-checkbox>
          
          <div class="product-info">
            <img :src="item.goodsImage" :alt="item.goodsName">
            <div class="product-detail">
              <router-link :to="`/user/shop/product/${item.id}`" class="product-name">
                {{ item.goodsName }}
              </router-link>
              <div class="stock-status" v-if="item.goodsNum < item.num">
                <i class="el-icon-warning"></i> 품절됨
              </div>
              <div class="stock-status" v-else>
                재고: {{item.goodsNum}}
              </div>
            </div>
          </div>

          <div class="product-price">
            <span class="current-price">¥{{ item.goodsMoney }}</span>
          </div>

          <div class="quantity-control">
            <el-input-number 
              v-model="item.num" 
              :min="1"
              :max="item.goodsNum"
              :disabled="item.goodsNum === 0"
              size="small"
              @change="handleQuantityChange(item)">
            </el-input-number>
          </div>

          <div class="subtotal">
            ¥{{ (item.goodsMoney * item.num).toFixed(2) }}
          </div>

          <div class="item-actions">
            <el-button type="text" class="delete-btn" @click="removeItem(item)">삭제</el-button>
          </div>
        </div>
      </div>

      <!-- 장바구니 하단 -->
      <div class="cart-footer">
        <div class="left-operations">
          <el-checkbox 
            v-model="selectAll"
            @change="handleSelectAllChange">
            전체 선택
          </el-checkbox>
        </div>
        
        <div class="right-settlement">
          <div class="settlement-info">
            <div class="selected-count">
              선택된 상품: <span class="highlight">{{ selectedCount }}</span> 개
            </div>
            <div class="total-price">
              합계: <span class="highlight">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <el-button 
            type="primary" 
            size="large"
            :disabled="selectedCount === 0"
            @click="checkout">
            결제하기
          </el-button>
        </div>
      </div>
    </div>

    <!-- 빈 장바구니 -->
    <div v-else class="empty-cart">
      <img src="https://img.alicdn.com/tfs/TB1NQ1d4VP7gK0jSZFjXXc5aXXa-280-280.png" 
           alt="빈 장바구니">
      <p>장바구니가 비어 있습니다</p>
      <el-button type="primary" @click="goShopping">쇼핑하러 가기</el-button>
    </div>

    <!-- 추천 상품 -->
    <div class="recommendations" v-if="recommendations.length">
      <h3>- 추천 상품 -</h3>
      <div class="recommendations-grid">
        <div v-for="item in recommendations" 
             :key="item.id" 
             class="recommendation-item"
             @click="viewProduct(item.id)">
          <img :src="item.image" :alt="item.name">
          <h4>{{ item.name }}</h4>
          <p class="recommendation-price">¥{{ item.money }}</p>
          <el-button type="primary" size="small" @click.stop="addToCart(item)">
            장바구니에 추가
          </el-button>
        </div>
      </div>
    </div>

    <!-- 결제 확인 다이얼로그 -->
    <el-dialog
      title="주문 확인"
      :visible.sync="showCheckoutDialog"
      width="500px"
      :before-close="handleDialogClose">
      <div class="checkout-dialog-content">
        <!-- 상품 목록 요약 -->
        <div class="checkout-items">
          <div v-for="item in selectedItems" :key="item.id" class="checkout-item">
            <img :src="item.goodsImage" :alt="item.goodsName">
            <div class="item-info">
              <div class="item-name">{{ item.goodsName }}</div>
              <div class="item-meta">
                <span class="item-price">¥{{ item.goodsMoney }}</span>
                <span class="item-quantity">x {{ item.num }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 비고 입력 -->
        <div class="remark-input">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="비고를 입력하세요 (선택 사항)"
            v-model="orderRemark"
            maxlength="200"
            show-word-limit>
          </el-input>
        </div>

        <!-- 주문 금액 -->
        <div class="order-amount">
          <span>주문 총액:</span>
          <span class="amount">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">취소</el-button>
        <el-button type="primary" @click="confirmCheckout" :loading="submitting">
          결제 확인
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cart',

}
</script>


<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cart-header h2 {
  font-weight: 500;
  color: #303133;
}

.cart-summary {
  color: #606266;
}

.highlight {
  color: #F56C6C;
  font-weight: bold;
}

.cart-main {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.cart-table-header {
  display: grid;
  grid-template-columns: 50px 3fr 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  color: #909399;
}

.cart-item {
  display: grid;
  grid-template-columns: 50px 3fr 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.cart-item.out-of-stock {
  opacity: 0.6;
}

.product-info {
  display: flex;
  gap: 15px;
}

.product-info img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  color: #303133;
  text-decoration: none;
  font-weight: 500;
}

.product-name:hover {
  color: #f3c3cc;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.spec-item {
  margin-right: 15px;
}

.stock-status {
  color: #F56C6C;
  font-size: 12px;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.current-price {
  color: #F56C6C;
  font-weight: bold;
}

.original-price {
  color: #909399;
  text-decoration: line-through;
  font-size: 12px;
}

.quantity-control {
  width: 120px;
}

.subtotal {
  color: #F56C6C;
  font-weight: bold;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delete-btn {
  color: #F56C6C;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
}

.left-operations {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right-settlement {
  display: flex;
  align-items: center;
  gap: 20px;
}

.settlement-info {
  text-align: right;
}

.empty-cart {
  text-align: center;
  padding: 50px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.empty-cart img {
  width: 180px;
  margin-bottom: 20px;
}

.empty-cart p {
  color: #909399;
  margin-bottom: 20px;
}

.recommendations {
  margin-top: 40px;
}

.recommendations h3 {
  text-align: center;
  color: #606266;
  margin-bottom: 20px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.recommendation-item {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.recommendation-item:hover {
  transform: translateY(-5px);
}

.recommendation-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.recommendation-item h4 {
  margin: 10px 0;
  color: #303133;
}

.recommendation-price {
  color: #F56C6C;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 结算对话框样式 */
.checkout-dialog-content {
  padding: 10px 0;
}

.checkout-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.checkout-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.checkout-item:last-child {
  border-bottom: none;
}

.checkout-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 14px;
  color: #303133;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606266;
}

.item-price {
  color: #F56C6C;
  font-weight: bold;
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

/* 滚动条样式优化 */
.checkout-items::-webkit-scrollbar {
  width: 6px;
}

.checkout-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.checkout-items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.checkout-items::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 