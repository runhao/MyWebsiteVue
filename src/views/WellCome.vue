<template>
  <div id="content">
    <audio id="audioMp3" src="/statics/beautiful_life.mp3" loop="loop" controls="controls"
           autoplay="autoplay"></audio>
    <h1>I Love 石燕</h1>
    <div id="differTime">
      <span>在一起的</span><span>{{ days }}</span>天<span>{{ hours }}</span>时<span>{{ minutes }}</span>分<span>{{ seconds }}</span>秒！
    </div>
    <img id="girlFriend" src="@/assets/img/photo.jpg" alt="Jpg">
  </div>
  <Distribution id="footer"/>
</template>

<script>
import { reactive } from 'vue';
import Distribution from "@/components/Distribution.vue"

export default {
  name: "WellCome",
  components: { Distribution },
  setup() {
    const targetDate = new Date("2024-07-06T16:00:00").getTime();

    const state = reactive({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    function calculateTimeDifference() {
      const now = new Date().getTime();
      const difference = now -targetDate;

      if (difference > 0) {
        state.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        state.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        state.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        state.seconds = Math.floor((difference % (1000 * 60)) / 1000);
      } else {
        // 如果时间已经过去
        state.days = 0;
        state.hours = 0;
        state.minutes = 0;
        state.seconds = 0;
      }
    }

    setInterval(() => {
      calculateTimeDifference();
    }, 1000);

    // 初始化时间差
    calculateTimeDifference();

    return state;
  },
}
</script>

<style scoped>
#footer {
  background-color: #eee;
  color: #555;
}

#content {
    text-align: center;
    min-height: 300px;
}

#differTime {
  display: flow;
  font-size: x-large;
  font-weight: 600;
}

#differTime span {
  font-size: x-large;
  font-weight: 600;
}

#girlFriend {
  max-width: 60%;
}
</style>