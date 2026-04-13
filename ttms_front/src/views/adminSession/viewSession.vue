<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { sessionGetOneService, sessionAlertService } from '@/api/session'
import { movieSearchService } from '@/api/movie'
import { hallGetListService } from '@/api/hall'
import { formatTime, findtheaterName } from '@/utils/data'

const route = useRoute()
const session_id = route.params.id
const trueInfo = ref({
  theater_name: '',
  theater_id: '',
  movie_name: '',
  movie_id: '',
  hall_id: '',
  session_id: '',
  price: '',
  start: ''
})
const disabled = ref(true)
// 取消修改时，把真实值赋值给表单formModel
const cancle = () => {
  formModel.value.theater_name = trueInfo.value.theater_name
  formModel.value.movie_name = trueInfo.value.movie_name
  formModel.value.movie_id = trueInfo.value.movie_id
  formModel.value.hall_id = trueInfo.value.hall_id
  formModel.value.price = trueInfo.value.price
  formModel.value.start = trueInfo.value.start
  disabled.value = true
}
// 把表单赋值给真实值
const success = () => {
  trueInfo.value.start = formatTime(formModel.value.start)
}
const changeSession = async () => {
  await form.value.validate()
  if (formatTime(formModel.value.start) < formatTime(new Date())) {
    ElMessage.error('场次时间不能小于当前时间')
    return
  }
  const res = await sessionAlertService({
    theater_id: trueInfo.value.theater_id,
    movie_id: formModel.value.movie_id,
    hall_id: formModel.value.hall_id,
    show_time: new Date(formModel.value.start),
    price: Number(formModel.value.price),
    session_id: trueInfo.value.session_id
  })
  if (res.data.status === 200) {
    success()
    disabled.value = true
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '修改失败'
    })
  }
}
// 关于表单
const formModel = ref({
  theater_name: '',
  start: '',
  price: '',
  hall_id: '',
  movie_id: '',
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
// 该影院的所有演出厅列表
const hall_list = ref([])
onMounted(async () => {
  const res = await sessionGetOneService(session_id)
  if (res.data.status === 200) {
    const data = res.data.data
    console.log(data)
    console.log(findtheaterName(data.Hall.TheaterID))
    trueInfo.value.theater_name = findtheaterName(data.Hall.TheaterID)
    trueInfo.value.theater_id = data.Hall.TheaterID
    trueInfo.value.session_id = data.ID
    trueInfo.value.movie_name = data.Movie.ChineseName
    trueInfo.value.movie_id = data.Movie.ID
    trueInfo.value.hall_id = data.Hall.ID
    trueInfo.value.hall_name = data.Hall.Name
    trueInfo.value.price = data.Price
    trueInfo.value.start = formatTime(data.ShowTime)
  } else {
    ElMessage({ message: '信息获取失败', type: 'error' })
  }
  const res1 = await hallGetListService(trueInfo.value.theater_id)
  if (res1.data.status === 200) {
    hall_list.value = res1.data.data.item
  } else {
    ElMessage({ message: '影厅列表获取失败', type: 'error' })
  }

  cancle()
})
const movie_list = ref([])
const loading = ref(false)
const remoteMethod = async (query) => {
  if (query) {
    loading.value = true
    const res = await movieSearchService(query)
    loading.value = false
    if (res.data.status === 200) {
      movie_list.value = res.data.data.item
      console.log(res.data.data)
    } else {
      movie_list.value = []
    }
  } else {
    movie_list.value = []
  }
}
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
        :size="formSize"
        status-icon
      >
        <el-form-item label="影院名称" prop="theater_name" class="form-item">
          <el-input
            v-model="formModel.theater_name"
            disabled
            placeholder="请输入影片名"
          />
        </el-form-item>
        <el-form-item label="影厅名称" prop="hall_id" class="form-item">
          <el-select
            disabled
            v-model="formModel.hall_id"
            placeholder="请选择演出厅"
            style="width: 240px"
          >
            <el-option
              v-for="item in hall_list"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
          /></el-select>
        </el-form-item>
        <el-form-item label="影片名称" prop="movie_name" class="form-item">
          <el-select
            v-model="formModel.movie_name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入影片名称"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 240px"
            disabled
          >
            <el-option
              v-for="item in movie_list"
              :key="item.id"
              :label="item.chinese_name"
              :value="item.chinese_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price" class="form-item">
          <el-input
            disabled
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
          <el-button class="btn1" type="primary" @click="changeSession()"
            >确认修改</el-button
          >
          <el-button class="btn1" type="primary" @click="cancle()"
            >取消修改</el-button
          >
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
      width: 70%;
      .form-item {
        margin-top: 40px;
        // border: 1px solid red;
      }
      .tags {
        .tag {
          width: 90px;
          height: 40px;
          margin-right: 10px;
          margin-bottom: 10px;
          text-align: center;
          line-height: 40px;
        }
      }
      .btn {
        width: 80%;
        height: 50px;
        margin: 70px 100px;
      }
      .btnGro {
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
