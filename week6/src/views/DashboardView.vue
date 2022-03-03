<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <router-link class="navbar-brand" to="/admin">後台</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/admin/products">產品列表</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/admin/coupon">優惠券</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/">回到前台</router-link>
              </li>
              <a href="#" class="nav-link" @click.prevent="signOut">登出</a>
            </ul>
          </div>
        </div>
      </nav>
      <router-view v-if="checkSuccess"></router-view>
    </div>
</template>

<script>
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      if (token) {
        this.$http.defaults.headers.common.Authorization = `${token}`
        const api = `${process.env.VUE_APP_API}/api/user/check`
        this.$http.post(api, { api_token: this.token })
          .then(() => {
            this.checkSuccess = true
          })
          .catch((err) => {
            alert(err)
            this.$router.push('/login')
          })
      } else {
        alert('您尚未登入')
        this.$router.push('/login')
      }
    },
    signOut () {
      // 清除token
      document.cookie = 'hexToken=;expires=;'
      alert('您已登出')
      this.$router.push('/login')
    }
  }
}
</script>
