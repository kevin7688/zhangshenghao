<template>
  <div class="shop-container">
    <!-- 검색 및 필터 영역 -->
    <div class="filter-section">
      <!-- 검색창 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="상품 이름 검색"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleSearch"
          class="search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">검색</el-button>
        </el-input>
      </div>

      <!-- 고급 필터 -->
      <div class="advanced-filter">
        <div class="filter-row">
          <span class="filter-label">카테고리：</span>
          <div class="filter-options">
            <el-tag :type="filter.category === '' ? 'primary' : ''"
                   @click="filter.category = ''"
                   class="filter-tag">전체</el-tag>
            <el-tag v-for="item in categories"
                   :key="item.value"
                   :type="filter.category === item.value ? 'primary' : ''"
                   @click="filter.category = item.value"
                   class="filter-tag">
              {{ item.label }}
            </el-tag>
          </div>
        </div>
        
        <div class="filter-row">
          <span class="filter-label">가격：</span>
          <div class="filter-options">
            <el-tag :type="filter.price === '' ? 'primary' : ''"
                   @click="filter.price = ''"
                   class="filter-tag">전체</el-tag>
            <el-tag v-for="item in priceRanges"
                   :key="item.value"
                   :type="filter.price === item.value ? 'primary' : ''"
                   @click="filter.price = item.value"
                   class="filter-tag">
              {{ item.label }}
            </el-tag>
          </div>
        </div>

        <div class="filter-row">
          <span class="filter-label">정렬：</span>
          <div class="filter-options">
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button label="1">기본 정렬</el-radio-button>
              <el-radio-button label="2">가격 낮은 순</el-radio-button>
              <el-radio-button label="3">가격 높은 순</el-radio-button>
              <el-radio-button label="4">판매량 우선</el-radio-button>
              <el-radio-button label="5">최신 등록</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- 선택 필터 표시 -->
        <div class="selected-filters" v-if="hasActiveFilters">
          <span class="filter-label">선택：</span>
          <el-tag v-if="filter.category" 
                 closable 
                 @close="filter.category = ''">
            카테고리：{{ getCategoryLabel(filter.category) }}
          </el-tag>
          <el-tag v-if="filter.price" 
                 closable 
                 @close="filter.price = ''">
            가격：{{ getPriceLabel(filter.price) }}
          </el-tag>
          <el-button type="text" @click="resetFilters">필터 초기화</el-button>
        </div>
      </div>
    </div>

    <!-- 상품 목록 -->
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card" @click="viewDetail(product.id)">
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <div class="product-tags">
            <span class="tag 신상품">{{ product.categoryName }}</span>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.remark }}</p>
          <div class="product-meta">
            <span class="price">¥{{ product.money }}</span>
            <span class="sales">판매 {{ product.sale }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shop',
  data() {
    return {
      searchQuery: '',
      filter: {
        category: '',
        price: ''
      },
      sortBy: '1',
      currentPage: 1,
      pageSize: 12,
      total: 100,
      categories: [],
      priceRanges: [
        { value: '1', label: '¥0-10000' },
        { value: '2', label: '¥10000-30000' },
        { value: '3', label: '¥30000-100000' },
        { value: '4', label: '¥100000-200000' },
        { value: '5', label: '¥200000 이상' }
      ],
      products: []
    }
  },
  computed: {
    hasActiveFilters() {
      return this.filter.category || this.filter.price
    }
  },
  created() {
    this.queryCate();
    this.handleSearch();
  },
  methods: {
    queryCate(){
        this.categories = [];
        const cnToKr = {
            "鞋子": "신발",
            "包包": "가방",
            "配饰": "액세서리",
            "服装": "의류"
        };
        this.$axios.post('/api/category/frontAll',{}).then(res => {
            for(var i in res.data.data){
               let cnName = res.data.data[i].name;
               this.categories.push({
                   value: res.data.data[i].id+'',
                   label: cnToKr[cnName] || cnName
               });
            }
         });
     },
    handleSearch() {
      var param = {
          name:this.searchQuery,
          status:'已发布',
          cid: this.filter && this.filter.category ? this.filter.category : '',
          money1: this.filter && this.filter.price ? this.filter.price : '',
          sortBy:this.sortBy,
          currentPage: this.currentPage,
          pagesize: this.pageSize,
      };
      this.$axios.post('/api/goods/frontPage',param).then(res => {
          this.products = res.data.data.list;
          this.total = res.data.data.total;
      });
    },
    getCategoryLabel(value) {
      const category = this.categories.find(item => item.value === value)
      return category ? category.label : ''
    },
    getPriceLabel(value) {
      const price = this.priceRanges.find(item => item.value === value)
      return price ? price.label : ''
    },
    resetFilters() {
      this.filter.category = ''
      this.filter.price = ''
      this.sortBy = '1'
      this.handleSearch();
    },
    handlePageChange(page) {
      this.currentPage = page
      this.handleSearch();
    },
    viewDetail(id) {
      this.$router.push(`/user/shop/product/${id}`)
    },
  }
}
</script>


<style scoped>
.shop-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 500px;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 500px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 12px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #909399;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.history-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
}

.history-item:hover {
  background: #ecf5ff;
  color: #f3c3cc;
}

.history-item i {
  margin-right: 4px;
  font-size: 12px;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-item {
  cursor: pointer;
}

.advanced-filter {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.filter-label {
  width: 60px;
  color: #606266;
  font-size: 14px;
}

.filter-options {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  cursor: pointer;
}

.selected-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #dcdfe6;
}

.selected-filters .el-button {
  margin-left: auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  height: 280px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.tag.新品 {
  background-color: #f3c3cc;
}

.tag.热销 {
  background-color: #F56C6C;
}

.tag.特惠 {
  background-color: #E6A23C;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.product-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.price {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
}

.sales {
  color: #999;
  font-size: 12px;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style> 