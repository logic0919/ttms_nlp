<script setup>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { hallDelService } from '@/api/hall'

const router = useRouter()
const props = defineProps({
  id: Number,
  name: String,
  row: Number,
  col: Number,
  index: Number
})
const color = computed(() => {
  return props.index % 2 == 0
    ? 'background-color: rgb(212, 212, 212);'
    : 'background-color: rgb(235, 235, 235);'
})
const adminHall = () => {
  router.push(`/admin/viewHall/${props.id}`)
}
const delHall = inject('delHall')
const delHallFn = () => {
  ElMessageBox.confirm('确定删除这个影厅吗？', '提示')
    .then(async () => {
      try {
        await hallDelService(props.id)
        delHall(props.id)
        ElMessage({ message: '删除成功', type: 'success' })
      } catch (e) {
        ElMessage({ message: e?.message || '删除失败，请稍后重试', type: 'error' })
      }
    })
    .catch(() => {})
}
</script>

<template>
  <div class="hallItem" :style="color">
    <div class="id">{{ id }}</div>
    <div class="name">{{ name }}</div>
    <div class="row">{{ row }}</div>
    <div class="col">{{ col }}</div>
    <span class="opea">
      <el-button type="primary" class="btn" @click="adminHall">查看</el-button>
      <el-button type="primary" class="btn" @click="delHallFn">删除</el-button>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.hallItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: antiquewhite;
  div {
    width: 20%;
    text-align: center;
  }
  .opea {
    width: 20%;
    display: flex;
    justify-content: space-evenly;
    .btn {
      width: 60px;
    }
  }
}
</style>