<template>
  <div class="app-container" :style="backgroundStyle">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>当前用户：{{ isLoggedIn ? '已登录' : '访客' }}</span>
      <a v-if="!isLoggedIn" href="/login" class="login-link">登录</a>
      <button v-else class="logout-button" @click="logout">退出</button>
    </div>

    <div class="content">
      <h1 class="title">脑洞制造</h1>
      <div class="card-container">
        <!-- 原有卡片内容保持不变 -->
        <a href="/chat-any" class="card">
          <h2>交互</h2>
          <p>Openai、Midjourney、Deepseek</p>
        </a>
        <a href="/wellcome" class="card">
          <h2>欢迎</h2>
          <p>这是我女朋友</p>
        </a>
        <a href="http://shiyan520.cn:8080" class="card">
          <h2>部署</h2>
          <p>Jenkins持续集成与部署平台</p>
        </a>
        <a href="http://naodongzhizao.com/admin" class="card">
          <h2>管理</h2>
          <p>Django后台管理系统</p>
        </a>
        <a href="https://github.com/runhao?tab=repositories" class="card">
          <h2>仓库</h2>
          <p>Github</p>
        </a>
        <a :href="isLoggedIn ? 'http://192.168.6.1' : 'javascript:void(0)'" class="card" :class="{ disabled: !isLoggedIn }">
          <h2>网络</h2>
          <p>OpenWrt</p>
        </a>
        <a :href="isLoggedIn ? 'http://192.168.31.211:8123' : 'javascript:void(0)'" class="card" :class="{ disabled: !isLoggedIn }">
          <h2>家居</h2>
          <p>HomeAssistant</p>
        </a>
      </div>
    </div>
  </div>
  <Distribution class="footer"/>
</template>

<script>
import Distribution from "@/components/Distribution.vue";

export default {
  name: "Index",
  components: {
    Distribution
  },
  data() {
    return {
      isLoggedIn: false, // 默认未登录
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${require('@/assets/background.gif')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
  },
  created() {
    this.checkLoginStatus(); // 组件创建时检查登录状态
  },
  methods: {
    checkLoginStatus() {
      // 检查 localStorage 中是否存在 access 和 refresh 令牌
      const accessToken = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      this.isLoggedIn = !!accessToken && !!refreshToken; // 如果两者都存在，则用户已登录
    },
    logout() {
      // 清除 localStorage 中的令牌
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      this.isLoggedIn = false; // 更新登录状态
      alert('已退出登录');
    }
  }
};
</script>

<style scoped>
/* 新增容器样式 */
.app-container {
  min-height: 100vh;
  position: relative;
  background-color: #f8f9fa;
}

/* 状态栏样式 */
.status-bar {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.login-link, .logout-button {
  text-decoration: none;
  color: #007bff;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #e7f1ff;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.login-link:hover, .logout-button:hover {
  background-color: #d0e3ff;
}

/* 调整内容区域间距 */
.content {
  padding: 80px 20px 20px; /* 顶部留出状态栏空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 保持原有其他样式不变 */
.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 100px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 150px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.card h2 {
  font-size: 1.5rem;
  margin: 10px 0;
}

.card p {
  font-size: 1rem;
  color: #666;
  text-align: center;
}

.footer {
  height: 10%;
  background-color: #eee;
  color: #555;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>