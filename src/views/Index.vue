<template>
  <div class="content">
    <div>
      <a href="http://shiyan520.cn:8080">Jenkins</a>
      <br>
      <a href="http://naodongzhizao.com/admin">admin</a>
    </div>
    <dialog open>
      <p>欢迎燕燕大美女进入!</p>
      <form method="dialog">
        <button type="button" @click="clickWellcome">快来欢迎我！</button>
        <button type="button" @click="clickLogin">进入门户页面</button>
      </form>
    </dialog>
  </div>
  <Distribution class="footer"/>
</template>

<script>
import {useRouter} from "vue-router";
import Distribution from "@/components/Distribution.vue";

export default {
  name: "Index",
  components: {Distribution},
  setup() {
    const router = useRouter()
    const clickLogin = () => {
      router.push('/login')
    }
    const clickWellcome = () => {
      router.push('/wellcome')
    }
    return {clickLogin, clickWellcome}
  },
}
</script>
<style scoped>
.content {
  min-height: 500px;
}

.footer {
  background-color: #eee;
  color: #555;
}
</style>

