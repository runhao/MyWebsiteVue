
<template>
	<el-form label-width="100px" class="container">
		<el-form-item label="账号">
			<el-input type="email" v-model="email" placeholder="用户名/邮箱"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button @click="handleForgotPassword" type="primary" class="submit-btn">找回密码</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { useRouter } from "vue-router"
import { ref, getCurrentInstance } from 'vue'
export default {

	setup() {
		// @ts-ignore
    const { ctx } = getCurrentInstance();
		const email = ref<string>("");

		const handleForgotPassword = async () => {
			if (email.value) {
				const res = await ctx.$axios.post('https://shiyan520.cn/api/v1/auth/forgotpassword', {email: email.value})
        let isSuccess = getSuccessState(res.data)
            if (!isSuccess){
              ctx.$message({
                message: `${res.data.msg}`,
                type: "error"
              })
              return false
            }
			}
		};
    const getSuccessState = (data:any) => {
      return !!data.success;
    };
		return {email, handleForgotPassword }
	},
}
</script>

<style scoped>

.container {
	width: 50%;
	margin: 200px auto;
}

.submit-btn {
  width: 100%;
}


</style>
