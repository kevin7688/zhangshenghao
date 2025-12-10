<template>
  <div class="home-container">
    <!-- 캐러셀 영역 -->
    <div class="carousel-section">
      <el-carousel height="500px">
        <el-carousel-item v-for="item in carouselItems" :key="item.id">
          <img :src="item.image" :alt="item.title" class="carousel-image">
          <div class="carousel-caption">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 코디 추천 영역 -->
    <div class="section-title">
      <h2>추천 코디</h2>
      <router-link to="/user/outfit" class="view-more">더보기</router-link>
    </div>
    <div class="outfits-grid">
      <div v-for="outfit in outfits" :key="outfit.id" class="outfit-card" @click="viewDetail(outfit.id)">
        <img :src="outfit.image" :alt="outfit.name">
        <div class="outfit-info">
          <h3>{{ outfit.name|filtersText1 }}</h3>
          <p>{{ outfit.content|filtersText }}</p>
          <div class="user-info">
            <span>{{ outfit.realname }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 상품 추천 영역 -->
    <div class="section-title">
      <h2>인기 상품</h2>
      <router-link to="/user/shop" class="view-more">더보기</router-link>
    </div>
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card" @click="viewDetail2(product.id)">
        <img :src="product.image" :alt="product.name">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="price">₩{{ product.money }}</p>
          <el-button type="primary" size="small" @click="addToCart(product)">장바구니에 담기</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      carouselItems: [
        {
          id: 1,
          image: require('../../../assets/img/01.jpg'),
          title: '봄 신상품 특가전',
          description: '봄 시즌 코디로 옷장에 새로운 색감을 더해보세요'
        },
        {
          id: 2,
          image: require('../../../assets/img/02.jpg'),
          title: '패션 스타일 가이드',
          description: '트렌드 리더와 함께 나만의 개성 있는 스타일 완성하기'
        },
        {
          id: 3,
          image: require('../../../assets/img/03.jpg'),
          title: '한정 할인 이벤트',
          description: '다양한 혜택이 여러분을 기다리고 있습니다'
        }
      ],
      outfits: [],
      products: []
    }
  },
  filters: {
    filtersText(val) {
      if (val != null && val != '') {
        let reg = /[\u4e00-\u9fa5]|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
        let names = val.match(reg);
        val = names ? names.join('') : '';
        return val.length > 30 ? val.substring(0, 30) + '...' : val;
      } else return '';
    },
    filtersText1(val) {
      if (val != null && val != '') {
        let reg = /[\u4e00-\u9fa5]|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
        let names = val.match(reg);
        val = names ? names.join('') : '';
        return val.length > 18 ? val.substring(0, 18) + '...' : val;
      } else return '';
    },
  },
  created() {
    this.getData();
    this.getGoods();
  },
  methods: {
    addToCart(product) {
      // 장바구니에 추가하는 로직
      this.$message.success('장바구니에 추가되었습니다');
    },
    // 데이터 불러오기 (코디)
    getData() {
        var param = {
            pagesize: 3, 
            currentPage: 1, 
            status:'已发布'
        };
        this.$axios.post('/api/outfit/frontPage',param).then(res => {
            if(res.data.code == 200){
                this.outfits = res.data.data.list;
            } else {
                this.$message.warning(res.data.msg);
            }
        });
    },
    // 데이터 불러오기 (상품)
    getGoods() {
        var param = {
            pagesize: 4, 
            currentPage: 1, 
            status:'已发布'
        };
        this.$axios.post('/api/goods/frontPage',param).then(res => {
            if(res.data.code == 200){
                this.products = res.data.data.list;
            } else {
                this.$message.warning(res.data.msg);
            }
        });
    },
    viewDetail2(id) {
      this.$router.push(`/user/shop/product/${id}`)
    },
    viewDetail(id) {
      this.$router.push(`/user/outfit/${id}`)
    }
  }
}
</script>


<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 20%;
  left: 10%;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-caption h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0 20px;
}

.view-more {
  color: #f3c3cc;
  text-decoration: none;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.outfit-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.outfit-card:hover {
  transform: translateY(-5px);
}

.outfit-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.outfit-info {
  padding: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.price {
  color: #f56c6c;
  font-size: 1.2em;
  margin: 10px 0;
}
</style> 