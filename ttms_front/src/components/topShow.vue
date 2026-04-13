<script setup>
const props = defineProps({
  text: String
})
console.log(props)
</script>

<template>
  <div class="topShow"></div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.topShow {
}
</style>
