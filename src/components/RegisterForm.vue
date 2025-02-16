<template>
  <el-form
    ref="registerForm"
    :model="registerUser"
    :rules="registerRules"
    label-width="100px"
    class="registerForm sign-up-form"
  >
    <el-form-item label="用户昵称" prop="name">
      <el-input
        v-model="registerUser.name"
        placeholder="Enter name..."
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model="registerUser.email"
        placeholder="Enter Email..."
      ></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="verificationCode">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-input
            v-model="registerUser.verificationCode"
            placeholder="Enter Verification Code..."
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            @click="sendVerificationCode"
            :disabled="isCodeSent"
            type="primary"
            class="send-code-btn"
            >{{ isCodeSent ? `已发送 (${countdown}s)` : '发送验证码' }}</el-button
          >
        </el-col>
      </el-row>
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
  </el-form>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

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
  setup(props: any) {
    // @ts-ignore
    const { proxy } = getCurrentInstance();
    const router = useRouter();

    const isCodeSent = ref(false); // 是否已发送验证码
    const countdown = ref(60); // 倒计时

    // 发送验证码
    const sendVerificationCode = () => {
      if (!props.registerUser.email) {
        proxy.$message({
          message: "请输入邮箱地址",
          type: "error",
        });
        return;
      }

      // 调用邮箱验证码接口
      proxy.$axios
        .post("/api/user/email_verification", {
          email: props.registerUser.email,
          action: '注册账号',
        })
        .then((res: any) => {
          if (res.data.data.success) {
            isCodeSent.value = true;
            startCountdown();
            proxy.$message({
              message: "验证码已发送，请查收邮件",
              type: "success",
            });
          } else {
            proxy.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        })
        .catch((err: any) => {
          proxy.$message({
            message: "发送验证码失败，请稍后重试",
            type: "error",
          });
        });
    };

    // 倒计时功能
    const startCountdown = () => {
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(timer);
          isCodeSent.value = false;
          countdown.value = 60;
        }
      }, 1000);
    };

    // 触发注册方法
    const handleRegister = (formName: string) => {
      proxy.$refs[formName].validate((valid: boolean) => {
        if (valid) {
          // 调用注册接口，传递用户信息和验证码
          proxy.$axios
            .post("/api/user/register", props.registerUser)
            .then((res: any) => {
              if (res.data.data.success) {
                // 注册成功
                proxy.$message({
                  message: "注册成功",
                  type: "success",
                });
                // 路由跳转
                router.push("/");
              } else {
                proxy.$message({
                  message: res.data.msg,
                  type: "error",
                });
              }
            })
            .catch((err: any) => {
              proxy.$message({
                message: "注册失败，请稍后重试",
                type: "error",
              });
            });
        } else {
          proxy.$message({
            message: "请填写完整信息",
            type: "error",
          });
          return false;
        }
      });
    };

    return { handleRegister, sendVerificationCode, isCodeSent, countdown };
  },
};
</script>

<style scoped>
.registerForm {
  margin-top: -100px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
  width: 100%;
}

.send-code-btn {
  width: 100%;
}

.sign-up-form {
  opacity: 0;
  z-index: 1;
}
</style>
