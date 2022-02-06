import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'shila-hexschool',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'));

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

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
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
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
        this.isNew = false;
        productModal.show();
      }else if( isNew === 'delete' ){
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    updateProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = "post";

      if ( !this.isNew ){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }

      axios[method](url, { data: this.tempProduct })
        .then( (res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch( (err) => {
          alert(err.data.message);
        })
      
    },
    delProduct(){
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then( (res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        } )  
        .catch( (err) => {
          alert(err.data.message);
        } )    
    }
  }
}).mount('#app');
