<template>
<div>
  <h2>產品列表</h2>
  <Loading :active="isLoading"></Loading>
  <div class="container">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td style="width: 200px">
                  <div style="height: 100px; background-size: cover;      background-position: center"
                       :style="{ backgroundImage:`url(${product.imageUrl})` }">
                  </div>
              </td>
              <td>
                {{ product.title }}
              </td>
              <td>
                  <div class="h5"
                       v-if="product.price === product.origin_price">
                      {{ product.price }} 元
                  </div>
                  <div v-else>
                    <del class="h6">原價 {{ product.origin_price }} 元</del>
                    <div class="h5">現在只要 {{ product.price }} 元</div>
                  </div>
              </td>
              <td>
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary" :disabled="loadingStatus.loadingItem === product.id || !product.is_enabled"
                    >
                      <router-link class="nav-link" :to="`/product/${product.id}`">
                      查看更多
                      </router-link>
                    </button>
                    <button type="button" class="btn btn-outline-danger"
                            @click="addToCart(product.id)"
                            :disabled="loadingStatus.loadingItem === product.id || !product.is_enabled">
                      <i class="fas fa-spinner fa-pulse"
                         v-show="loadingStatus.loadingItem === product.id"></i>
                      加到購物車
                    </button>
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
  </div>
</div>
</template>

<script>
import emitter from '@/libs/emitter'

export default {
  data () {
    return {
      cartData: {},
      products: [],
      loadingStatus: {
        loadingItem: ''
      },
      isLoading: false
    }
  },
  methods: {
    getProducts () {
      this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`)
        .then((res) => {
          // 從api取得所有產品資料，加入data的products
          this.products = res.data.products
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    addToCart (id, qty = 1) {
      this.isLoading = true
      const data = {
        product_id: id,
        qty
      }
      this.loadingStatus.loadingItem = id
      this.$http.post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`, { data })
        .then((res) => {
          this.loadingStatus.loadingItem = ''
          emitter.emit('get-cart')
          this.isLoading = false
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
