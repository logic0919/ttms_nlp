<script setup>
// import { Location, Menu, Document, Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { hallGetListService } from '@/api/hall'
import { computed, provide, ref, watch } from 'vue'
const router = useRouter()
const theater_id = ref('')
const hallList = ref([])
const hallNum = computed(() => {
  return hallList.value.length
})
const getList = async () => {
  const res = await hallGetListService(theater_id.value)
  if (res.data.status === 200) {
    hallList.value = res.data.data.item
    if (hallList.value === null) {
      hallList.value = []
    }
  } else {
    ElMessage({ message: '演出厅列表获取失败', type: 'error' })
  }
}
watch(
  () => router.currentRoute.value,
  (newValue) => {
    theater_id.value = newValue.params.id
    getList()
  },
  { immediate: true }
)
// 路由跳转至添加影厅的界面
const addHall = () => {
  router.push(`/admin/addHall/${theater_id.value}`)
}
const delHall = (targetId) => {
  hallList.value = hallList.value.filter((item) => item.ID !== targetId)
}
provide('delHall', (id) => {
  delHall(id)
})
</script>

<template>
  <div class="showHall">
    <div class="top">
      <div class="total">总共有{{ hallNum }}个演出厅</div>
      <div class="add">
        <el-button type="primary" icon="el-icon-plus" @click="addHall"
          >添加演出厅</el-button
        >
      </div>
    </div>
    <div class="empty" v-if="hallList.length == 0"><empty-com></empty-com></div>
    <div class="main" v-else>
      <div class="nav">
        <div class="id">影厅id</div>
        <div class="name">影厅名称</div>
        <div class="row">影厅行数</div>
        <div class="col">影厅列数</div>
        <div class="opea">操作</div>
      </div>
      <hall-item
        v-for="(i, index) in hallList"
        :key="i.ID"
        :id="i.ID"
        :name="i.Name"
        :row="i.SeatRow"
        :col="i.SeatColumn"
        :index="index"
        :theater="theater_id"
      ></hall-item>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.showHall {
  width: 80%;
  min-width: 700px;
  margin: 0 auto;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid rgb(105, 105, 105);
    margin-bottom: 30px;
    .total {
    }
    .add {
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .nav {
      display: flex;
      justify-content: space-between;
      height: 80px;
      background-color: rgb(235, 235, 235);
      background-color: rgb(127, 127, 127);
      color: white;
      font-size: 20px;
      font-weight: 500;
      div {
        width: 20%;
        text-align: center;
        line-height: 80px;
      }
    }
  }
}
</style>
