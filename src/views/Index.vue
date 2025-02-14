<template>
  <div class="app-container" :style="backgroundStyle">
    <div class="status-bar">
      <span>当前用户：{{ isLoggedIn ? name : '访客' }}</span>
      <router-link v-if="!isLoggedIn" to="/login" class="login-link">登录</router-link>
      <button v-else class="logout-button" @click="indexLogout">退出</button>
    </div>

    <div class="content">
      <h1 class="title">脑洞制造</h1>
      <div class="card-container">
        <router-link :to="isLoggedIn ? '/chat-any' : 'javascript:void(0)'" class="card"
                     :class="{ disabled: !isLoggedIn }">
          <h2>交互<span v-if="!isLoggedIn">(无权限)</span></h2>
          <p>Openai、Midjourney、Deepseek</p>
        </router-link>
        <router-link to="/wellcome" class="card">
          <h2>欢迎</h2>
          <p>这是我女朋友</p>
        </router-link>
        <a :href="isLoggedIn ? 'http://shiyan520.cn:8080' : 'javascript:void(0)'" class="card"
           :class="{ disabled: !isLoggedIn }">
          <h2>部署<span v-if="!isLoggedIn">(无权限)</span></h2>
          <p>Jenkins持续集成与部署平台</p>
        </a>
        <a :href="isLoggedIn ? 'http://naodongzhizao.com/admin' : 'javascript:void(0)'" class="card"
           :class="{ disabled: !isLoggedIn }">
          <h2>管理<span v-if="!isLoggedIn">(无权限)</span></h2>
          <p>Django后台管理系统</p>
        </a>
        <a href="https://github.com/runhao?tab=repositories" class="card">
          <h2>仓库</h2>
          <p>Github</p>
        </a>
        <a :href="isLoggedIn ? 'http://192.168.6.1' : 'javascript:void(0)'" class="card"
           :class="{ disabled: !isLoggedIn }">
          <h2>网络<span v-if="!isLoggedIn">(无权限)</span></h2>
          <p>OpenWrt</p>
        </a>
        <a :href="isLoggedIn ? 'http://192.168.31.211:8123' : 'javascript:void(0)'" class="card"
           :class="{ disabled: !isLoggedIn }">
          <h2>家居<span v-if="!isLoggedIn">(无权限)</span></h2>
          <p>HomeAssistant</p>
        </a>
      </div>
    </div>
    <Distribution class="footer"/>
  </div>
</template>

<script>
import Distribution from "@/components/Distribution.vue";
import {isTokenExpired, logout, computeName} from "@/utils/token";

export default {
  name: "Index",
  components: {
    Distribution
  },
  data() {
    return {
      isLoggedIn: false,
      name: '',
      checkInterval: null
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
    this.checkLoginStatus();
    this.startTokenCheck();
  },
  beforeDestroy() {
    this.stopTokenCheck();
  },
  methods: {
    checkLoginStatus() {
      const accessToken = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      this.isLoggedIn = !!accessToken && !!refreshToken;
    },
    async checkTokenExpiry() {
      const accessToken = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      if (accessToken && refreshToken) {
        const expired = await isTokenExpired(accessToken, refreshToken);
        if (expired) {
          this.isLoggedIn = false;
          return true
        }
        return false
      }
    },
    indexLogout() {
      this.isLoggedIn = false;
      logout();
    },
    startTokenCheck() {
      // 立即执行一次
      this.checkTokenExpiry().then(async () => {
        if (this.isLoggedIn) {
          if (!await this.checkTokenExpiry()) {
            debugger
            this.name = await computeName(localStorage.getItem('access'));
          }
        }
      });

      // 每30秒重复执行
      this.checkInterval = setInterval(async () => {
        if (this.isLoggedIn) {
          if (!await this.checkTokenExpiry()) {
            this.name = await computeName(localStorage.getItem('access'));
          }
        }
      }, 30000);
    },
    stopTokenCheck() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }
    }
    ,
  },
  watch: {
    async isLoggedIn(newVal) {
      if (!newVal) {
        logout();
        this.name = ''
      }
    }
    ,
  }
}
;
</script>

<style scoped>
.app-container {
  min-height: 115vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f8f9fa;
}

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

.content {
  flex: 1;
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
  background-color: rgba(255, 255, 255, 0.4);
  color: #555;
  padding: 10px;
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 10;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
