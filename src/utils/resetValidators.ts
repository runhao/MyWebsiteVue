import { ref } from "vue";

// 忘记密码表单数据接口
interface ResetPasswordUser {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

// 忘记密码表单数据
export const resetPasswordUser = ref<ResetPasswordUser>({
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
});

// 忘记密码表单验证规则接口
interface ResetPasswordRules {
  email: {
    type: string;
    message: string;
    required: boolean;
    trigger: string;
  }[];
  verificationCode: {
    message: string;
    required: boolean;
    trigger: string;
  }[];
  newPassword: ({
    required: boolean;
    message: string;
    trigger: string;
  } | {
    min: number;
    max: number;
    message: string;
    trigger: string;
  })[];
  confirmPassword: ({
    required: boolean;
    message: string;
    trigger: string;
  } | {
    validator: (rule: ResetPasswordUser, value: string, callback: any) => void;
    trigger: string;
  })[];
}

// 确认密码验证函数
const validateConfirmPassword = (rule: ResetPasswordUser, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== resetPasswordUser.value.newPassword) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

// 忘记密码表单验证规则
export const resetPasswordRules = ref<ResetPasswordRules>({
  email: [
    { type: "email", message: "请输入有效的邮箱地址", required: true, trigger: 'blur' }
  ],
  verificationCode: [
    { message: "验证码不能为空", required: true, trigger: 'blur' }
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: 'blur'
    },
    {
      min: 6,
      max: 30,
      message: "密码长度必须为6到30个字符",
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: "请再次输入新密码",
      trigger: 'blur'
    },
    {
      validator: validateConfirmPassword,
      trigger: 'blur'
    }
  ]
});
