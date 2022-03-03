
// VeeValiadation
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 加入多國語系外部資源
loadLocaleFromURL('./zh_TW.json');

// Activate the locale
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: false, // 調整為輸入字元立即進行驗證
});


const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath= 'shila-hexschool';

const app = Vue.createApp({
    data(){
        return{
            cartData:{

            },
            products:[],
            product:{},
            productId:'',
            loadingStatus:{
                loadingItem: '',
            },
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
            },
        }
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
      },
    methods:{
        getProducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then((res) => {
                    // 從api取得所有產品資料，加入data的products
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        openProductModal(id){
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.get(url).then((response) => {
                console.log(response)
              this.loadingStatus.loadingItem = '';
              this.product = response.data.product;
              this.$refs.productModal.openModal();
            }).catch((err) => {
              alert(err.data.message);
            });
        },
        getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then((res) => {
                    this.cartData = res.data.data;
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        addToCart(id,qty = 1){
            const data = {
                product_id:id,
                qty,
            }
            this.loadingStatus.loadingItem = id;
            this.$refs.productModal.hideModal();
            axios.post(`${apiUrl}/api/${apiPath}/cart`,{ data })
                .then((res) => {
                    this.getCart();
                    this.loadingStatus.loadingItem = '';
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        deleteAllCarts() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        removeCartItem(id){
            this.loadingStatus.loadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)  
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                    this.loadingStatus.loadingItem = '';
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        updateCart(item){
            this.loadingStatus.loadingItem = item.id;
            const cart = {
                product_id:item.product_id,
                qty:item.qty,
            }
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{ data : cart})  
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                    this.loadingStatus.loadingItem = '';
                })
                .catch((err) => {
                    alert(err.data.message)
                    this.loadingStatus.loadingItem = '';
                })
        },
        creatOrder(){
            const order = this.form;
            axios.post(`${apiUrl}/api/${apiPath}/order`,{ data: order })
                .then( (res) => {
                    alert(res.data.message);
                    // 清空表單
                    this.$refs.form.resetForm();
                    this.form.message = '';
                    // 清空購物車
                    this.getCart();
                })
                .catch( (err) => {
                    alert(err.data.message)
                })
        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('product-modal',{
    template:'#userProductModal',
    data(){
        return{
            modal:'',
            qty: 1,
        }
    },
    props: {
        product: {
          type: Object,
          default() {
            return {
            }
          }
        }
    },
    methods:{
        openModal(){
            this.modal.show()
        },
        hideModal() {
            this.modal.hide();
          },
    },
    mounted(){
        // ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
   
})

app.mount('#app');