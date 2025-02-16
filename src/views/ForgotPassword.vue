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
      <el-row :gutter="10">
        <el-col :span="16">
          <el-input v-model="forgotUser.verificationCode" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
              @click="handleSendVerificationCode"
              :disabled="isCodeSent"
              type="primary"
              class="send-code-btn"
          >
            {{ isCodeSent ? `已发送 (${countdown}s)` : '发送验证码' }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="forgotUser.newPassword" type="password" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="forgotUser.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleResetPassword('forgotForm')" type="primary" class="submit-btn">提交</el-button>
    </el-form-item>
    <!-- 返回登录 -->
    <div class="tipArea">
      <p>想起密码? <a @click.prevent="handleBackToLogin">返回登录</a></p>
    </div>
  </el-form>
</template>

<script lang="ts">
import {ref, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import {resetPasswordUser, resetPasswordRules} from '@/utils/resetValidators' // 引入表单数据和验证规则

export default {
  setup() {
    // @ts-ignore
    const {proxy} = getCurrentInstance()
    const router = useRouter()

    // 表单数据
    const forgotUser = resetPasswordUser

    // 验证码发送状态
    const isCodeSent = ref(false)
    const countdown = ref(60)

    // 发送验证码
    const handleSendVerificationCode = () => {
      if (!forgotUser.value.email) {
        proxy.$message({
          message: '请输入邮箱地址',
          type: 'error',
        })
        return
      }

      // 调用邮箱验证码接口
      proxy.$axios
          .post('/api/user/email_verification', {
            email: forgotUser.value.email,
            action: '重置密码',
          })
          .then((res: any) => {
            if (res.data.data.success) {
              isCodeSent.value = true
              startCountdown()
              proxy.$message({
                message: '验证码已发送，请查收邮件',
                type: 'success',
              })
            } else {
              proxy.$message({
                message: res.data.msg,
                type: 'error',
              })
            }
          })
          .catch((err: any) => {
            proxy.$message({
              message: '发送验证码失败，请稍后重试',
              type: 'error',
            })
          })
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
    const handleResetPassword = (formName: string) => {
      proxy.$refs[formName].validate((valid: boolean) => {
        if (valid) {
          proxy.$axios
              .post('/api/user/reset_password', {
                email: forgotUser.value.email,
                verification_code: forgotUser.value.verificationCode,
                new_password: forgotUser.value.newPassword
              })
              .then((res: any) => {
                if (res.data.data.success) {
                  proxy.$message({
                    message: '密码重置成功',
                    type: 'success',
                  })
                  router.push('/login')
                } else {
                  proxy.$message({
                    message: res.data.msg,
                    type: 'error',
                  })
                }
              })
              .catch((err: any) => {
                proxy.$message({
                  message: '密码重置失败，请检查输入信息',
                  type: 'error',
                })
              })
        } else {
          proxy.$message({
            message: '请填写完整信息',
            type: 'error',
          })
          return false
        }
      })
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

.send-code-btn {
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
