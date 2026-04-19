<script setup>
import { onMounted, ref } from 'vue'
import { hallGetListService } from '@/api/hall'
import { formatTime } from '@/utils/data'
import { movieSearchService, movieGetInfoService } from '@/api/movie'
import { sessionAddService } from '@/api/session'
import { ElMessage } from 'element-plus'

const formModel = ref({
  theater_name: '',
  start: '',
  price: '',
  hall_id: '',
  movie_id: ''
})
const form = ref(null)
const rules = ref({
  theater_name: [{ required: true, message: '请选择影院', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  hall_id: [{ required: true, message: '请选择影厅', trigger: 'blur' }],
  movie_id: [{ required: true, message: '请选择影片', trigger: 'blur' }],
  start: [{ required: true, message: '请选择开场时间', trigger: 'blur' }]
})

const hall_list = ref([])
const movie_list = ref([])
const selectedMovieDuration = ref(120) // 默认时长 120 分钟

// 新后端：GET /hall/list → { success, data: { halls: [...] } }
// 字段：hall_id / name（原来是 ID / Name）
const getHallList = async () => {
  try {
    const res = await hallGetListService()
    hall_list.value = res.data.data.halls.halls || []
  } catch (e) {
    ElMessage({ message: '影厅列表获取失败', type: 'error' })
  }
}

onMounted(() => {
  getHallList()
})

const loading = ref(false)

// 新后端：GET /movie/seabyname?chinese_name=xxx → { success, data: [...movies] }
// 字段：movie_id / chinese_name / duration
const remoteMethod = async (query) => {
  if (query) {
    loading.value = true
    try {
      const res = await movieSearchService(query)
      movie_list.value = res.data.data.movies || []
    } catch (e) {
      movie_list.value = []
    } finally {
      loading.value = false
    }
  } else {
    movie_list.value = []
  }
}

// 选中电影时获取时长，用于计算 etime
const onMovieChange = async (movieId) => {
  try {
    const res = await movieGetInfoService(movieId)
    const data = res.data.data
    const movie = Array.isArray(data) ? data[0] : data
    selectedMovieDuration.value = parseInt(movie?.duration) || 120
  } catch (e) {
    selectedMovieDuration.value = 120
  }
}

// 新后端：POST /session/create，body: { movie_id, hall_id, stime, etime, price }
// stime / etime 为 "YYYY-MM-DD HH:mm" 格式字符串
const addSession = async () => {
  await form.value.validate()
  const nowTime = formatTime(new Date())
  const startTime = formatTime(formModel.value.start)
  if (startTime < nowTime) {
    ElMessage.error('场次时间不能小于当前时间')
    return
  }
  const stimeMs = new Date(formModel.value.start).getTime()
  const etimeMs = stimeMs + selectedMovieDuration.value * 60 * 1000
  const etime = formatTime(new Date(etimeMs))

  try {
    await sessionAddService({
      movie_id: formModel.value.movie_id,
      hall_id: Number(formModel.value.hall_id),
      stime: startTime,
      etime: etime,
      price: Number(formModel.value.price)
    })
    ElMessage({ type: 'success', message: '添加成功' })
  } catch (e) {
    ElMessage({ type: 'error', message: '添加失败' })
  }
}
</script>

<template>
  <div class="addSession">
    <div class="main">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm form"
        status-icon
      >
        <el-form-item label="影厅名称" prop="hall_id" class="form-item">
          <!-- 新后端：hall_id / name（原来是 ID / Name） -->
          <el-select
            v-model="formModel.hall_id"
            placeholder="请选择演出厅"
            style="width: 240px"
          >
            <el-option
              v-for="item in hall_list"
              :key="item.hall_id"
              :label="item.name"
              :value="item.hall_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="影片名称" prop="movie_id" class="form-item">
          <!-- 新后端：movie_id / chinese_name（原来是 id / chinese_name） -->
          <el-select
            v-model="formModel.movie_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入影片名称"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 240px"
            @change="onMovieChange"
          >
            <el-option
              v-for="item in movie_list"
              :key="item.movie_id"
              :label="item.chinese_name"
              :value="item.movie_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price" class="form-item">
          <el-input v-model="formModel.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="开场时间" prop="start" class="form-item">
          <el-date-picker
            v-model="formModel.start"
            type="datetime"
            placeholder="请选择开场时间"
          />
        </el-form-item>
        <el-button class="btn" type="primary" @click="addSession"
          >添加场次</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.addSession {
  width: 80%;
  margin: 0 auto;
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .form {
      width: 70%;
      .form-item {
        margin-top: 40px;
      }
      .btn {
        width: 80%;
        height: 50px;
        margin: 70px 100px;
      }
    }
  }
}
</style>
