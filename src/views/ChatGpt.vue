<template>
  <div class="content">
    <!-- 嵌套外部网页 -->
    <iframe
      src="https://naodongzhizao.com:3000"
      width="100%"
      height="500"
      allowfullscreen>
      style="border: none;"
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
  min-height: 500px;
}

.footer {
  background-color: #eee;
  color: #555;
}
</style>

