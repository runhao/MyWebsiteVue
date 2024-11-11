<template>
	<el-form ref="loginForm" :model="loginUser" :rules="rules" label-width="100px" class="loginForm sign-in-form">
		<el-form-item label="账号" prop="email">
			<el-input v-model="loginUser.email" placeholder="用户名/邮箱."></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input v-model="loginUser.password" type="password" placeholder="请输入密码..." ></el-input>
		</el-form-item>
		<el-form-item>
			<el-button @click="handleLogin('loginForm')" type="primary" class="submit-btn">提交</el-button>
		</el-form-item>
		<!-- 找回密码 -->
		<div class="tiparea">
			<!-- prevent取消默认时间 -->
      <p>忘记密码? <a @click.prevent="handleForgot">立即找回</a></p>
    </div>
	</el-form>
</template>

<script lang="ts">
import { useRouter } from "vue-router"
import { ref, getCurrentInstance } from 'vue'
export default {
	props: {
		loginUser: {
			type: Object,
			required: true
		},
		rules: {
			type: Object,
			required: true
		}
	},
	setup(props:any) {
		// @ts-ignore
    const { ctx } = getCurrentInstance()
		
		const router = useRouter()

    // 触发登录方法
    const handleLogin = (formName: string) => {
      // console.log(formName)
      // console.log(ctx)
      ctx.$refs[formName].validate((valid: boolean) => {
        if (valid) {
					ctx.$axios.post("/api/user/login", props.loginUser).then((res:any) =>{
            let isSuccess = getSuccessState(res.data)
            if (!isSuccess){
              // 登录失败
              ctx.$message({
                message: `${res.data.msg}`,
                type: "error"
              })
              return false
            }
						// 登录成功
						ctx.$message({
							message: `${res.data.msg}`,
							type: "success"
						})

						// 路由跳转 
						router.push('/index')
					})
        } else {
          return false;
        }
      });
    }


		const handleForgot = () => {
			router.push('/forgotpassword')
		}

    const getSuccessState = (data:any) => {
      return !!data.success;
    }

		return { handleLogin, handleForgot }
	},
}
</script>

<style scoped>

/* form表单 */
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.submit-btn {
  width: 100%;
}

.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}

.tiparea p a {
  color: #409eff;
}

</style>