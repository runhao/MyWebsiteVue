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

export default {
  name: "ChatGpt",
  components: {Distribution},

  setup() {
    const {proxy} = getCurrentInstance()
    // 在组件挂载后调用接口
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem('access'); // 从 localStorage 获取 JWT
        const response = await proxy.$axios.post("/api/openai/key", {}, {
          headers: {
            Authorization: `Bearer ${jwtToken}` // 将 JWT 添加到请求头
          }
        });
        const data = response.data;
        // 弹出框显示返回的内容
        alert(JSON.stringify(data)); // 你可以根据需要格式化显示内容
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

