<template>
  <div class="content">
    <!-- 嵌套外部网页 -->
    <iframe
        src="/gpt"
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
import { getCurrentInstance, onMounted, onUnmounted } from "vue";
import { jwtDecode } from 'jwt-decode';

export default {
  name: "ChatGpt",
  components: { Distribution },

  setup() {
    const { proxy } = getCurrentInstance();

    // 检查 JWT 是否过期
    const isTokenExpired = async (accessToken, refreshToken) => {
      if (!accessToken) return true;
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000; // 当前时间（秒）
      if (decoded.exp < now) {
        try {
          const res = await proxy.$axios.post("/api/refresh/", {
            refresh: refreshToken // 将 refreshToken 放入请求体
          }, {
            headers: {
              'Content-Type': 'application/json' // 确保请求头正确
            }
          });
          localStorage.setItem('access', res.data.access);
          return false; // 刷新成功，返回 false
        } catch (error) {
          // 捕获错误，检查是否是 401 状态
          return error.response && error.response.status === 401;
           // 或者根据需要返回其他值
        }
      }
      return false; // 令牌未过期
    };

    // 定期检查 JWT
    const checkTokenInterval = setInterval(async () => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      // 检查 JWT 是否过期
      const expired = await isTokenExpired(accessToken, refreshToken);
      debugger
      if (expired) {
        alert("您的登录已过期，请重新登录。");
        await proxy.$router.push("/login"); // 跳转到登录页面
        clearInterval(checkTokenInterval); // 清除定时器
      }
    }, 30000); // 每30秒检查一次

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
        console.error("获取KEY值失败:", error); // 记录错误信息
      }
    };

    // 使用 onMounted 生命周期钩子调用 fetchData
    onMounted(() => {
      fetchData(); // 组件挂载后调用接口
    });

    // 清理定时器
    onUnmounted(() => {
      clearInterval(checkTokenInterval);
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
