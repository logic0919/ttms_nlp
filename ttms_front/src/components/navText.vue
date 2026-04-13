<script setup>
const props = defineProps({
  info: String,
  eng: String
})
console.log(props)
</script>

<template>
  <!-- <div class="navText">{{ info }}</div> -->
  <div class="text-container">
    <span class="background-text">{{ eng }}</span>
    <span class="foreground-text">{{ info }}</span>
  </div>
</template>

<style lang="scss" scoped>
// .navText {
//   width: 160px;
//   height: 24px;
//   line-height: 24px;
//   border-left: 4px solid red;
//   //   background-color: aquamarine;
//   padding-left: 20px;
//   letter-spacing: 10px;
// }
.text-container {
  position: relative;
  display: inline-block;
}

.background-text {
  font-size: 30px;
  font-weight: bold;
  background: radial-gradient(circle, #f1d8e3, #e6a7bd, #ffe6f0);
  -webkit-background-clip: text;
  color: transparent;
  position: absolute;
  top: 10px;
  left: 14px;
  z-index: 1;
}

.foreground-text {
  font-size: 28px;
  font-weight: bold;
  color: red;
  position: relative;
  z-index: 2;
}
</style>
