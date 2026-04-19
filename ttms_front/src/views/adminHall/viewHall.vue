<script setup>
import { ref, provide, onMounted } from 'vue'
import { hallGetService, hallChangeService } from '@/api/hall'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const formModel = ref({ name: '', col: '', row: '' })
const form = ref(null)
const rules = ref({
  name: [{ required: true, message: '请输入影厅名', trigger: 'blur' }],
  row: [{ required: true, message: '请输入影厅座位行数', trigger: 'blur' }],
  col: [{ required: true, message: '请输入影厅座位列数', trigger: 'blur' }]
})

const trueInfo = ref({ name: '', col: '2', row: '2' })
const seat = ref([])
let realSeat = []
const trueSeat = ref([])

const copyArr = (originalArray) => {
  let newArray = []
  for (let i = 0; i < originalArray.length; i++) {
    newArray[i] = []
    for (let j = 0; j < originalArray[i].length; j++) {
      newArray[i][j] = originalArray[i][j]
    }
  }
  return newArray
}

// 将后端返回的一维字符串解析为二维数组
const parseSeatStr = (seatStr, rnum, cnum) => {
  const arr = seatStr.split(',').map(Number)
  const matrix = []
  for (let i = 0; i < rnum; i++) {
    matrix.push(arr.slice(i * cnum, (i + 1) * cnum))
  }
  return matrix
}

// 新后端：GET /hall/seabyid?hall_id=xxx → { success, data: { hall_id, name, rnum, cnum, seat } }
// data 是单个对象（不是数组），字段名为 name/rnum/cnum/seat（字符串）
const getInfo = async () => {
  try {
    const res = await hallGetService(id)
    const data = res.data.data
    trueInfo.value.name = data.name
    trueInfo.value.row = data.rnum
    trueInfo.value.col = data.cnum
    // 后端 seat 是逗号分隔字符串，转回二维数组
    const matrix = parseSeatStr(data.seat, data.rnum, data.cnum)
    trueSeat.value = copyArr(matrix)
    realSeat = copyArr(matrix)
    toTemp()
  } catch (e) {
    ElMessage({ message: '演出厅信息获取失败', type: 'error' })
  }
}

const toTemp = () => {
  formModel.value.col = trueInfo.value.col
  formModel.value.row = trueInfo.value.row
  formModel.value.name = trueInfo.value.name
  seat.value = copyArr(trueSeat.value)
}

onMounted(() => { getInfo() })

const isChange = ref(false)
const switchOpea = (a) => { isChange.value = a }

const drawer2 = ref(false)

const setSeat = () => {
  if (
    !formModel.value.row ||
    !formModel.value.col ||
    Number(formModel.value.row) === 0 ||
    Number(formModel.value.col) === 0
  ) {
    ElMessage.warning('请输入合适的行数和列数')
    return
  }
  if (
    Number(formModel.value.row) === trueSeat.value.length &&
    Number(formModel.value.col) === trueSeat.value[0]?.length
  ) {
    seat.value = copyArr(trueSeat.value)
  } else {
    setDefaultSeat()
  }
  drawer2.value = true
}

const setDefaultSeat = () => {
  seat.value = Array.from({ length: Number(formModel.value.row) }, () =>
    Array.from({ length: Number(formModel.value.col) }, () => 1)
  )
}

provide('changeStatus', (obj) => {
  seat.value[obj.row - 1][obj.col - 1] = obj.status
})

const handleClose = () => {
  ElMessageBox.confirm('确定保留该种状态吗？', '提示')
    .then(() => {
      trueSeat.value = copyArr(seat.value)
      seat.value = null
      drawer2.value = false
    })
    .catch(() => {
      drawer2.value = false
    })
}

// 将二维数组序列化为逗号分隔字符串
const getSeatStr = () => {
  return trueSeat.value.map((item) => item.join(',')).join(',')
}

const cancle = () => {
  formModel.value.col = trueInfo.value.col
  formModel.value.row = trueInfo.value.row
  formModel.value.name = trueInfo.value.name
  trueSeat.value = copyArr(realSeat)
  switchOpea(false)
}

// 新后端：POST /hall/update，body: { hall_id, name, rnum, cnum, seat }
const changeHall = async () => {
  await form.value.validate()
  if (Number(formModel.value.row) === 0 || Number(formModel.value.col) === 0) {
    ElMessage.warning('请输入合适的行数和列数')
    return
  }
  if (
    Number(formModel.value.row) !== trueSeat.value.length ||
    Number(formModel.value.col) !== trueSeat.value[0]?.length
  ) {
    ElMessage.warning('输入的行列数和设置的座位表的行列数不一致')
    return
  }
  try {
    await hallChangeService({
      hall_id: Number(id),
      name: formModel.value.name,
      rnum: Number(formModel.value.row),
      cnum: Number(formModel.value.col),
      seat: getSeatStr()
    })
    ElMessage({ message: '修改影厅成功', type: 'success' })
    // 更新本地真实值
    trueInfo.value.name = formModel.value.name
    trueInfo.value.row = formModel.value.row
    trueInfo.value.col = formModel.value.col
    realSeat = copyArr(trueSeat.value)
    switchOpea(false)
  } catch (e) {
    ElMessage({ message: '操作失败，请稍后重试', type: 'error' })
  }
}
</script>

<template>
  <div class="viewHall">
    <div class="main">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm form"
        status-icon
      >
        <el-form-item label="影厅名" prop="name" class="form-item" required>
          <el-input v-model="formModel.name" :disabled="!isChange" placeholder="请输入影厅名" />
        </el-form-item>
        <el-form-item label="行数" prop="row" class="form-item">
          <el-input v-model="formModel.row" :disabled="!isChange" placeholder="请输入座位行数" />
        </el-form-item>
        <el-form-item label="列数" prop="col" class="form-item">
          <el-input v-model="formModel.col" :disabled="!isChange" placeholder="请输入座位列数" />
        </el-form-item>
        <el-form-item label="座位表" class="form-item" required>
          <el-button type="primary" class="btn1" :disabled="!isChange" plain @click="setSeat()">设置座位表</el-button>
        </el-form-item>
        <div class="seat" v-if="trueSeat.length != 0">
          <seat-table-admin :row="trueInfo.row" :col="trueInfo.col" :seat="trueSeat"></seat-table-admin>
        </div>

        <el-drawer v-model="drawer2" size="600px" :before-close="handleClose" direction="rtl">
          <template #header><h4>设置座位表</h4></template>
          <template #default>
            <seat-table-admin :row="formModel.row" :col="formModel.col" :seat="seat"></seat-table-admin>
          </template>
        </el-drawer>

        <el-button class="btn" type="primary" v-if="!isChange" @click="switchOpea(true)">修改影厅</el-button>
        <div class="btnGro">
          <el-button class="btn" type="primary" v-if="isChange" @click="changeHall">保存修改</el-button>
          <el-button class="btn" type="primary" v-if="isChange" @click="cancle()">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.viewHall {
  width: 80%;
  margin: 0 auto;
  .main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .seat {
      margin: 40px;
      padding-top: 20px;
      width: 800px;
      height: 600px;
      border: 1px dashed red;
      display: flex;
      justify-content: space-between;
      align-content: space-between;
    }
    .form {
      width: 70%;
      .form-item { margin-top: 40px; }
      .btn { width: 80%; height: 50px; margin: 70px 100px; }
      .btnGro {
        display: flex;
        justify-content: space-around;
        margin: 70px 100px;
        .btn { width: 40%; margin: 0px; margin-left: 70px; }
      }
      .btn1 { padding: 15px; }
    }
  }
}
</style>