<script setup>
import { useRouter } from 'vue-router'
import { hallGetListService } from '@/api/hall'
import { computed, provide, ref, watch } from 'vue'

const router = useRouter()
const theater_id = ref('')
const hallList = ref([])
const hallNum = computed(() => hallList.value.length)

// 新后端：GET /hall/list → { success, data: { halls: [...] } }
// 接口不再需要 theater_id，返回全部影厅
const getList = async () => {
  try {
    const res = await hallGetListService()
    hallList.value = res.data.data.halls.halls || []
  } catch (e) {
    hallList.value = []
    ElMessage({ message: '演出厅列表获取失败', type: 'error' })
  }
}

watch(
  () => router.currentRoute.value,
  () => {
    getList()
  },
  { immediate: true }
)

const addHall = () => {
  router.push(`/admin/addHall/${theater_id.value}`)
}

// 新后端用 hall_id 字段（原来是 ID）
const delHall = (targetId) => {
  hallList.value = hallList.value.filter((item) => item.hall_id !== targetId)
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
        <el-button type="primary" @click="addHall">添加演出厅</el-button>
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
      <!-- 新后端字段：hall_id / name / rnum / cnum（原来是 ID / Name / SeatRow / SeatColumn） -->
      <hall-item
        v-for="(i, index) in hallList"
        :key="i.hall_id"
        :id="i.hall_id"
        :name="i.name"
        :row="i.rnum"
        :col="i.cnum"
        :index="index"
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
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .nav {
      display: flex;
      justify-content: space-between;
      height: 80px;
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
