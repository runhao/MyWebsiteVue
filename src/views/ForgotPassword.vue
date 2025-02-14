<template>
  <el-form
    ref="forgotForm"
    :model="forgotUser"
    :rules="resetPasswordRules"
    label-width="100px"
    class="forgotForm sign-in-form"
  >
    <el-form-item label="邮箱地址" prop="email">
      <el-input v-model="forgotUser.email" placeholder="请输入邮箱地址"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="verificationCode">
      <el-input v-model="forgotUser.verificationCode" placeholder="请输入验证码">
        <template #append>
          <el-button @click="handleSendVerificationCode" :disabled="isCodeSent">
            {{ isCodeSent ? `${countdown}秒后重试` : '发送验证码' }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="forgotUser.newPassword" type="password" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="forgotUser.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleResetPassword" type="primary" class="submit-btn">提交</el-button>
    </el-form-item>
    <!-- 返回登录 -->
    <div class="tipArea">
      <p>想起密码? <a @click.prevent="handleBackToLogin">返回登录</a></p>
    </div>
  </el-form>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { resetPasswordUser, resetPasswordRules } from '@/utils/resetValidators' // 引入表单数据和验证规则

export default {
  setup() {
    // @ts-ignore
    const { ctx } = getCurrentInstance()
    const router = useRouter()

    // 表单数据
    const forgotUser = resetPasswordUser

    // 验证码发送状态
    const isCodeSent = ref(false)
    const countdown = ref(60)

    // 发送验证码
    const handleSendVerificationCode = async () => {
      if (!forgotUser.value.email) {
        ElMessage.error('请输入邮箱地址')
        return
      }

      try {
        const res = await ctx.$axios.post('https://shiyan520.cn/api/user/send_verification_code', {
          email: forgotUser.value.email
        })
        if (res.data.success) {
          ElMessage.success('验证码已发送，请查收邮件')
          isCodeSent.value = true
          startCountdown()
        } else {
          ElMessage.error(res.data.msg)
        }
      } catch (error) {
        ElMessage.error('发送验证码失败，请稍后重试')
      }
    }

    // 倒计时
    const startCountdown = () => {
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(timer)
          isCodeSent.value = false
          countdown.value = 60
        }
      }, 1000)
    }

    // 重置密码
    const handleResetPassword = async () => {
      try {
        await ctx.$refs.forgotForm.validate()
        const res = await ctx.$axios.post('https://shiyan520.cn/api/user/reset_password', {
          email: forgotUser.value.email,
          verification_code: forgotUser.value.verificationCode,
          new_password: forgotUser.value.newPassword
        })
        if (res.data.success) {
          ElMessage.success('密码重置成功')
          router.push('/login')
        } else {
          ElMessage.error(res.data.msg)
        }
      } catch (error) {
        ElMessage.error('密码重置失败，请检查输入信息')
      }
    }

    // 返回登录
    const handleBackToLogin = () => {
      router.push('/login')
    }

    return {
      forgotUser,
      resetPasswordRules,
      isCodeSent,
      countdown,
      handleSendVerificationCode,
      handleResetPassword,
      handleBackToLogin
    }
  }
}
</script>

<style scoped>
/* form表单 */
.forgotForm {
  margin-top: 100px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
  width: 100%;
}

.tipArea {
  text-align: right;
  font-size: 12px;
  color: #333;
}

.tipArea p a {
  color: #409eff;
}

.sign-in-form {
  z-index: 2;
}
</style>
