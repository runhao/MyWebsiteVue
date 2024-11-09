<template>
    <div class="index"> 首页 </div>
    <a @click="handleJump"> 点击跳转登录 </a>
</template>

<script>
import {useRouter} from "vue-router";

export default {
    name: "Index",
    components:{},
    setup() {
      const router = useRouter()
      const handleJump = () => {
        router.push('/login')
		  }
      return{handleJump}
    },
}
</script>
<style scoped>

</style>

