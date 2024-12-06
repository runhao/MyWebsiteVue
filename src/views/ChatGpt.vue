<template>
  <div class="content">
    <!-- 嵌套外部网页 -->
    <iframe
        src="https://naodongzhizao.com:3000"
        width="100%"
        height="800"
        allowfullscreen
        class="gpt-iframe"
    >
    </iframe>
  </div>
  <Distribution class="footer"/>
</template>

<script>
import Distribution from "@/components/Distribution.vue";
import {getCurrentInstance, onMounted} from "vue";
import {jwtDecode} from 'jwt-decode';

export default {
  name: "ChatGpt",
  components: {Distribution},

  setup() {
    const {proxy} = getCurrentInstance()

    // 检查 JWT 是否过期
    const isTokenExpired = async (accessToken, refreshToken) => {
      if (!accessToken) return true;
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000; // 当前时间（秒）
      if (decoded.exp > now) {
        const response = await proxy.$axios.post("/api/refresh/", {
          refresh: refreshToken // 将 refreshToken 放入请求体
        }, {
          headers: {
            'Content-Type': 'application/json' // 确保请求头正确
          }
        });
        if (response.status === 200) {
          localStorage.setItem('access', response.data.access);
          return false
        }
        return true // 如果过期，返回 true
      }
      return false
    };

    // 定期检查 JWT
    const checkTokenInterval = setInterval(async () => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      // 检查 JWT 是否过期
      const expired = await isTokenExpired(accessToken, refreshToken);

      // 检查 JWT 是否过期
      if (expired) {
        alert("您的登录已过期，请重新登录。");
        await proxy.$router.push("/login"); // 跳转到登录页面
        clearInterval(checkTokenInterval); // 清除定时器
      }
    }, 10000); // 每分钟检查一次（60000 毫秒）

    // 在组件挂载后调用接口
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access'); // 从 localStorage 获取 JWT
        const response = await proxy.$axios.post("/api/openai/key", {}, {
          headers: {
            Authorization: `Bearer ${accessToken}` // 将 JWT 添加到请求头
          }
        });
        const data = response.data;
        // 弹出框显示返回的内容
        alert(`KEY值获取成功，请复制粘贴：${data.data.value}`); // 弹出框显示成功消息和 key 值
      } catch (error) {
        alert("获取KEY值失败，请重新登陆或联系管理员。");
      }
    };

    // 使用 onMounted 生命周期钩子调用 fetchData
    onMounted(() => {
      fetchData(); // 组件挂载后调用接口
    });

    return {}
  },
}
</script>
<style scoped>
.content {
  min-height: 800px;
}

.gpt-iframe {
  border: none;
}

.footer {
  background-color: #eee;
  color: #555;
}
</style>

