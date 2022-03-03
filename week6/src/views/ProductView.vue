<template>
<div>
  <Loading :active="isLoading"></Loading>
  <div class="container">
      <!-- row 決定內層的數量 -->
      <div class="my-3">
        <h2>{{ product.title }}</h2>
      </div>
      <div class="">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="product.imagesUrl" alt="" />
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">
                {{product.category}}
              </span>
              <p>商品描述：{{ product.description }}</p>
              <p>商品內容：{{ product.content }}</p>
              <div class="h5" v-if="!product.price">
                {{ product.origin_price }} 元
              </div>
              <del class="h6" v-if="product.price"
                >原價 {{ product.origin_price }} 元</del
              >
              <div class="h5" v-if="product.price">
                現在只要 {{ product.price }} 元
              </div>
              <div>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="qty"
                    min="1"
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addToCart(product.id)"
                    :disabled="loadingStatus.loadingItem === product.id"
                  >
                   <i
                      class="fas fa-spinner fa-pulse"
                       v-if="loadingStatus.loadingItem === product.id"
                   ></i>
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
  </div>
</div>
</template>

<script>
import emitter from '@/libs/emitter'

export default {
  data () {
    return {
      product: {},
      qty: 1,
      loadingStatus: {
        loadingItem: ''
      },
      isLoading: false
    }
  },
  methods: {
    getProduct () {
      // $router -> 方法
      // $route -> 物件 -> 取值
      const { id } = this.$route.params
      this.$http(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`)
        .then((res) => {
          this.product = res.data.product
        })
    },
    addToCart (id, qty = 1) {
      const data = {
        product_id: id,
        qty
      }
      if (this.qty <= 0) {
        alert('請輸入正確數量')
      } else {
        this.loadingStatus.loadingItem = id
        this.isLoading = true
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
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
