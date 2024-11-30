<template>
  <div class="content">
    <!-- 嵌套外部网页 -->
    <iframe
      src="https://shiyan520.cn/gpt"
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

export default {
  name: "ChatGpt",
  components: {Distribution},
  setup() {

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

