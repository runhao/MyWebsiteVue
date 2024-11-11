<template>
  <div id="content">
    <audio id="audioMp3" src="@/assets/meida/beautiful_life.mp3" loop="loop" controls="controls"
           autoplay="autoplay"></audio>
    <h1>I Love 石燕</h1>
    <div id="differTime">
      <span>在一起的</span><span>{{ days }}</span>天<span>{{ hour }}</span>时<span>{{ minute }}</span>分<span>{{
        second
      }}</span><span>秒！</span>
    </div>
    <img id="girlFriend" src="@/assets/img/photo.jpg" alt="Jpg">
  </div>
  <Distribution id="footer"/>
</template>

<script>
import Distribution from "@/components/Distribution.vue"

export default {
  name: "WellCome",
  components: {Distribution},
  setup() {
    window.onload = function () {
      const home = document.getElementById("differTime");
      let dd = Number(home.children[1].innerHTML);
      let hh = Number(home.children[2].innerHTML);
      let mm = Number(home.children[3].innerHTML);
      let ss = Number(home.children[4].innerHTML);
      setInterval(changeDate, 1000);

      function fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
      }

      function changeDate() {
        document.getElementById("differTime").innerText = "在一起的" + fix(dd, 2) + "天" + fix(hh, 2) + "时" + fix(mm, 2) + "分" + fix(ss, 2) + "秒!";
        ss++;
        if (ss === 60) {
          ss = 0;
          mm++;
          if (mm === 60) {
            mm = 0;
            hh++;
            if (hh === 24) {
              hh = 0;
            }
          }
        }
      }
    };
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

