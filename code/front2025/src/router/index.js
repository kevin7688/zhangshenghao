import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/user/helloHome'
        },
        {
            path: '/admin/',
            component: () => import('../components/common/admin/Home.vue'),
            meta: {title: '관리자 홈'},
            children: [
                {
                    path: '/admin/AdminList',
                    component: () => import('../components/page/admin/AdminList.vue'),
                    meta: {title: '관리자 관리'}
                },
                {
                    path: '/admin/CartList',
                    component: () => import('../components/page/admin/CartList.vue'),
                    meta: {title: '쇼핑 관리'}
                },
                {
                    path: '/admin/CategoryList',
                    component: () => import('../components/page/admin/CategoryList.vue'),
                    meta: {title: '카테고리 관리'}
                },
                {
                    path: '/admin/CommentList',
                    component: () => import('../components/page/admin/CommentList.vue'),
                    meta: {title: '게시물 댓글 관리'}
                },
                {
                    path: '/admin/DiscussList',
                    component: () => import('../components/page/admin/DiscussList.vue'),
                    meta: {title: '코디 댓글 관리'}
                },
                {
                    path: '/admin/ForumList',
                    component: () => import('../components/page/admin/ForumList.vue'),
                    meta: {title: '게시물 관리'}
                },
                {
                    path: '/admin/GoodsList',
                    component: () => import('../components/page/admin/GoodsList.vue'),
                    meta: {title: '상품 관리'}
                },
                {
                    path: '/admin/OrdersList',
                    component: () => import('../components/page/admin/OrdersList.vue'),
                    meta: {title: '주문 관리'}
                },
                {
                    path: '/admin/OrderItemList',
                    component: () => import('../components/page/admin/OrderItemList.vue'),
                    meta: {title: '주문 항목 관리'}
                },
                {
                    path: '/admin/OutfitList',
                    component: () => import('../components/page/admin/OutfitList.vue'),
                    meta: {title: '코디 정보 관리'}
                },
                {
                    path: '/admin/StarsList',
                    component: () => import('../components/page/admin/StarsList.vue'),
                    meta: {title: '즐겨찾기 관리'}
                },
                {
                    path: '/admin/UserList',
                    component: () => import('../components/page/admin/UserList.vue'),
                    meta: {title: '사용자 관리'}
                },
                {
                    path: '/admin/ReviewList',
                    component: () => import('../components/page/admin/ReviewList.vue'),
                    meta: {title: '상품 리뷰 관리'}
                },
                {
                    path: '/admin/*',
                    redirect: '/404'
                }
            ]
        }, {
            path: '/user/',
            component: () => import('../components/common/user/Home.vue'),
            meta: {title: '홈'},
            children: [
                {
                    path: '/user/helloHome',
                    component: () => import('../components/page/user/Home.vue'),
                    meta: {title: '홈'}
                },
                {
                    path: '/user/outfit/:id',
                    component: () => import('../components/page/user/OutfitDetail.vue'),
                    meta: {title: '코디 상세'}
                },
                {
                    path: '/user/outfit',
                    component: () => import('../components/page/user/OutfitSharing.vue'),
                    meta: {title: '코디 공유'}
                },
                {
                    path: '/user/shop',
                    component: () => import('../components/page/user/Shop.vue'),
                    meta: {title: '쇼핑몰'}
                },
                {
                    path: '/user/shop/product/:id',
                    component: () => import('../components/page/user/ProductDetail.vue'),
                    meta: {title: '상품 상세'}
                },
                {
                    path: '/user/forum',
                    component: () => import('../components/page/user/Forum.vue'),
                    meta: {title: '커뮤니티'}
                },
                {
                    path: '/user/forum/post/:id',
                    component: () => import('../components/page/user/PostDetail.vue'),
                    meta: {title: '게시물 상세'}
                },
                {
                    path: '/user/cart',
                    component: () => import('../components/page/user/Cart.vue'),
                    meta: {title: '장바구니'}
                },
                {
                    path: '/user/404',
                    component: () => import('../components/page/user/404.vue'),
                    meta: {title: '404'}
                },
            ]
        },
        {
            path: '/userlogin',
            component: () => import('../components/page/admin/login.vue'),
            meta: {title: '로그인'}
        },{
            path: '/userregister',
            component: () => import('../components/page/admin/register.vue'),
            meta: {title: '회원가입'}
        },
        {
            path: '*',
            redirect: '/user/404'
        }
    ]
});
