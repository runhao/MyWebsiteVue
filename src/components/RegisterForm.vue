<template>
  <el-form
    ref="registerForm"
    :model="registerUser"
    :rules="registerRules"
    label-width="100px"
    class="registerForm sign-up-form"
  >
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="registerUser.username"
        placeholder="Enter username..."
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="registerUser.email"
        placeholder="Enter Email..."
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input
        v-model="registerUser.phone"
        placeholder="Enter Phone..."
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="registerUser.password"
        type="password"
        placeholder="Enter Password..."
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input
        v-model="registerUser.password2"
        type="password"
        placeholder="Enter Password2..."
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="handleRegister('registerForm')"
        type="primary"
        class="submit-btn"
        >注册</el-button
      >
    </el-form-item>
    <!-- 找回密码 -->

  </el-form>
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router"

export default {
  props: {
    registerUser: {
      type: Object,
      required: true,
    },
    registerRules: {
      type: Object,
      required: true,
    },
  },
  setup(props:any) {
    // @ts-ignore
    const { proxy } = getCurrentInstance();

		const router = useRouter()

    // 触发注册方法
    const handleRegister = (formName: string) => {
      // console.log(formName)
      // console.log(proxy)
      proxy.$refs[formName].validate((valid: boolean) => {
        if (valid) {
          // alert("submit!");
          proxy.$axios.post("/api/user/register", props.registerUser).then((res:any) =>{
            let isSuccess = getSuccessState(res.data)
            if (!isSuccess){
              proxy.$message({
                message: `${res.data.msg}`,
                type: "error"
              })
              return false
            }
						// 注册成功
						proxy.$message({
							message: `${res.data.msg}`,
							type: "success"
						})

						// 路由跳转 
						router.push('/login')
					})
        } else {
          return false;
        }
      });
    };

    const getSuccessState = (result: any) => {
      return !!result.data.success;
    }

    return { handleRegister };
  },
};
</script>

<style scoped>
</style>