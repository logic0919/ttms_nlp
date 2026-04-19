<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { sessionGetOneService, sessionAlertService } from '@/api/session'
import { movieGetInfoService } from '@/api/movie'
import { hallGetListService } from '@/api/hall'
import { formatTime } from '@/utils/data'
import { ElMessage } from 'element-plus'

const route = useRoute()
const session_id = route.params.id

const trueInfo = ref({
  hall_name: '',
  movie_name: '',
  movie_id: '',
  hall_id: '',
  session_id: '',
  price: '',
  start: '',
  etime: '',
  movie_duration: 120
})
const disabled = ref(true)

const cancle = () => {
  formModel.value.theater_name = trueInfo.value.theater_name
  formModel.value.movie_name = trueInfo.value.movie_name
  formModel.value.hall_id = trueInfo.value.hall_id
  formModel.value.price = trueInfo.value.price
  formModel.value.start = trueInfo.value.start
  disabled.value = true
}

const changeSession = async () => {
  await form.value.validate()
  const nowTime = formatTime(new Date())
  const startTime = formatTime(formModel.value.start)
  if (startTime < nowTime) {
    ElMessage.error('场次时间不能小于当前时间')
    return
  }
  // 用电影时长计算新的结束时间
  const stimeMs = new Date(formModel.value.start).getTime()
  const etimeMs = stimeMs + (trueInfo.value.movie_duration || 120) * 60 * 1000
  const etime = formatTime(new Date(etimeMs))

  // 新后端：POST /session/update，body: { session_id, movie_id, hall_id, stime, etime, price }
  try {
    await sessionAlertService({
      session_id: trueInfo.value.session_id,
      movie_id: trueInfo.value.movie_id,
      hall_id: trueInfo.value.hall_id,
      stime: startTime,
      etime: etime,
      price: Number(formModel.value.price)
    })
    trueInfo.value.start = startTime
    trueInfo.value.etime = etime
    trueInfo.value.price = formModel.value.price
    disabled.value = true
    ElMessage({ type: 'success', message: '修改成功' })
  } catch (e) {
    ElMessage({ type: 'error', message: '修改失败' })
  }
}

const formModel = ref({
  hall_name: '',
  start: '',
  price: '',
  hall_id: '',
  movie_name: ''
})
const form = ref(null)
const rules = ref({
  theater_name: [{ required: true, message: '请选择影院', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  hall_id: [{ required: true, message: '请选择影厅', trigger: 'blur' }],
  movie_name: [{ required: true, message: '请选择影片', trigger: 'blur' }],
  start: [{ required: true, message: '请选择开场时间', trigger: 'blur' }]
})

const hall_list = ref([])

onMounted(async () => {
  try {
    // 新后端：GET /session/seabyid?id=xxx → { success, data: session }
    // session 字段：session_id / movie_id / hall_id / stime / etime / price
    const res = await sessionGetOneService(session_id)
    const data = res.data.data

    trueInfo.value.session_id = data.session_id
    trueInfo.value.movie_id = data.movie_id
    trueInfo.value.hall_id = data.hall_id
    trueInfo.value.price = data.price
    trueInfo.value.start = data.stime
    trueInfo.value.etime = data.etime

    // 获取电影名称和时长
    try {
      const movieRes = await movieGetInfoService(data.movie_id)
      const movieData = movieRes.data.data
      trueInfo.value.movie_name = movieData?.chinese_name || '未知影片'
      trueInfo.value.movie_duration = parseInt(movieData?.duration) || 120
    } catch (e) {
      // trueInfo.value.movie_name = '未知影片'
      ElMessage({ message: '影片信息获取失败', type: 'error' })
    }

    // 获取所有影厅列表（用于下拉选择）
    // 新后端：GET /hall/list → { success, data: { halls: [...] } }，字段：hall_id / name
    const hallRes = await hallGetListService(data.hall_id)
    hall_list.value = hallRes.data.data.halls.halls || []
    // 找到当前场次对应的影厅名（用于 hall_name 回填）
    const hall = hall_list.value.find((h) => h.hall_id === data.hall_id)

    if (hall) trueInfo.value.hall_name = hall.name + ' 未知影厅名'
  } catch (e) {
    ElMessage({ message: '信息获取失败', type: 'error' })
  }

  cancle()
})
</script>

<template>
  <div class="viewSession">
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
            disabled
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
        <el-form-item label="影片名称" prop="movie_name" class="form-item">
          <el-input
            v-model="formModel.movie_name"
            disabled
            placeholder="影片名称"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price" class="form-item">
          <el-input
            :disabled="disabled"
            v-model="formModel.price"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="开场时间" prop="start" class="form-item">
          <el-date-picker
            :disabled="disabled"
            v-model="formModel.start"
            type="datetime"
            placeholder="请选择开场时间"
          />
        </el-form-item>
        <el-button
          v-if="disabled"
          class="btn"
          type="primary"
          @click="disabled = false"
          
        
          >修改信息</el-button
        >
            
          
        <div class="btnGro" v-else>
            
          
          <el-button class="btn1" type="primary" @click="changeSession()">确认修改</el-button>
          <el-button class="btn1" type="primary" @click="cancle()">取消修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viewSession {
  width: 80%;
  margin: 0 auto;
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .form {
       
     
      width:
        70%;
       
       
     
      .form-item {
        margin-top: 40px;
      }
      .btn {
         
         
         
       
        width: 80%;
        height: 50px;
        margin: 70px 100px;
      }
      .b
tnGro {
        display: flex;
        justify-content: space-between;
        .btn1 {
          width: 200px;
          height: 50px;
          margin: 70px 100px;
        }
      }
    }
  }
}
</style>
