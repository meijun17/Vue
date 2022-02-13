import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'shila-hexschool',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination:{},
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          const { products,pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    openModal(isNew,item) {
      if ( isNew === 'new'){
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isNew = true;
        productModal.show();
      }else if( isNew === 'edit' ){
        this.tempProduct = { ...item };
        // 當 tempProduct.imagesUrl 有資料時就使用原本的資料，沒有的話就賦予一個陣列
        this.tempProduct.imagesUrl = this.tempProduct.imagesUrl ? this.tempProduct.imagesUrl : []
        this.isNew = false;
        productModal.show();
      }else if( isNew === 'delete' ){
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  }
})

// 分頁元件
app.component('pagination',{
  template:'#pagination',
  props:['pages'],
  methods:{
    emitPage(page){
      this.$emit('emit-page',page)
    }
  }
})

// 新增/編輯元件
app.component('productModal',{
  template:'#productModal',
  props:['product','isNew'],
  data(){
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'shila-hexschool',
      modal: null,
    }
  },
  methods:{
    updateProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = "post";
      if ( !this.isNew ){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
        method = 'put'
      }
      axios[method](url, { data: this.product })
        .then( (res) => {
          productModal.hide();
          this.$emit('update')
        })
        .catch( (err) => {
          alert(err.data.message);
        })
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
  },
})

// 刪除元件
app.component('delProductModal',{
  data(){
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'shila-hexschool',
      modal: null,
    }
  },
  template:'#delProductModal',
  props:['product'],
  methods:{
    delProduct(){
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
      axios.delete(url)
        .then( (res) => {
          delProductModal.hide();
          this.$emit('update');
        } )  
        .catch( (err) => {
          alert(err.data.message);
        } )    
    }
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  },
})

app.mount('#app');
