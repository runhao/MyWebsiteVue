<template>
  <div class="content">
    <iframe src="https://naodongzhizao.com:3000" width="100%" height="800" allowfullscreen
            class="chat-any-iframe"></iframe>
  </div>
  <Distribution class="footer"/>
</template>

<script>
import Distribution from "@/components/Distribution.vue";
import {getCurrentInstance, onMounted, onUnmounted} from "vue";
import {isTokenExpired, logout} from "@/utils/token";

export default {
  name: "ChatAny",
  components: {
    Distribution
  },
  setup() {
    const {proxy} = getCurrentInstance();

    const checkTokenInterval = setInterval(async () => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      const expired = await isTokenExpired(accessToken, refreshToken);

      if (expired) {
        logout();
        await proxy.$router.push("/");
        clearInterval(checkTokenInterval);
      }
    }, 30000);

    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await proxy.$axios.post("/api/openai/token", {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = response.data;
        alert(`TOKEN获取成功，支持模型为${data.data.type}，请复制粘贴：${data.data.key}`);
      } catch (error) {
        alert("获取TOKEN值失败，请重新登陆或联系管理员。");
        console.error("获取TOKEN值失败:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    onUnmounted(() => {
      clearInterval(checkTokenInterval);
    });

    return {};
  },
}
</script>

<style scoped>
.content {
  min-height: 800px;
}

.chat-any-iframe {
  border: none;
}

.footer {
  background-color: #eee;
  color: #555;
}
</style>