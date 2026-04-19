<script setup>
import { ref, provide, watch } from 'vue'
import { hallAddService } from '@/api/hall'
import { ElMessage, ElMessageBox } from 'element-plus'


const formModel = ref({
  name: '',
  col: '',
  row: '',
  theater: ''
})
const form = ref(null)
const rules = ref({
  name: [{ required: true, message: '请输入影厅名', trigger: 'blur' }],
  row: [{ required: true, message: '请输入影厅座位行数', trigger: 'blur' }],
  col: [{ required: true, message: '请输入影厅座位列数', trigger: 'blur' }],
  theater: [{ required: true, message: '请选择影院', trigger: 'blur' }]
})
const seat = ref([])

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

watch(
  () => ({ row: formModel.value.row, col: formModel.value.col }),
  () => { seat.value = [] },
  { immediate: true, deep: true }
)

const drawer2 = ref(false)
const tempSeat = ref([])

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
  if (seat.value.length === 0) {
    setDefaultSeat()
  } else {
    tempSeat.value = copyArr(seat.value)
  }
  drawer2.value = true
}

const setDefaultSeat = () => {
  tempSeat.value = Array.from({ length: Number(formModel.value.row) }, () =>
    Array.from({ length: Number(formModel.value.col) }, () => 1)
  )
  return tempSeat.value
}

provide('changeStatus', (obj) => {
  tempSeat.value[obj.row - 1][obj.col - 1] = obj.status
})

const handleClose = () => {
  ElMessageBox.confirm('确定保留该种状态吗？', '提示')
    .then(() => {
      seat.value = copyArr(tempSeat.value)
      tempSeat.value = []
      drawer2.value = false
    })
    .catch(() => {
      drawer2.value = false
    })
}

// 将二维数组序列化为逗号分隔字符串，供后端存储
const getSeatStr = () => {
  return seat.value.map((item) => item.join(',')).join(',')
}


// 新后端：POST /hall/create，body: { name, rows, cols, array }
// 注意字段名：rows / cols / array（不是 seat_row / seat_column / seat）
const addHall = async () => {
  await form.value.validate()
  if (seat.value.length === 0) {
    ElMessage({ message: '请先生成座位表', type: 'error' })
    return
  }
  try {
    await hallAddService({
      name: formModel.value.name,
      rows: Number(formModel.value.row),
      cols: Number(formModel.value.col),
      array: getSeatStr()
    })
    ElMessage({ message: '创建影厅成功', type: 'success' })
  } catch (e) {
    ElMessage({ message: '操作失败，请稍后重试', type: 'error' })
  }
}
</script>

<template>
  <div class="hallAdd">
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
          <el-input v-model="formModel.name" placeholder="请输入影厅名" />
        </el-form-item>
        <el-form-item label="行数" prop="row" class="form-item">
          <el-input v-model="formModel.row" placeholder="请输入座位行数" />
        </el-form-item>
        <el-form-item label="列数" prop="col" class="form-item">
          <el-input v-model="formModel.col" placeholder="请输入座位列数" />
        </el-form-item>
        <el-form-item label="座位表" class="form-item" required>
          <el-button type="primary" class="btn1" plain @click="setSeat()">设置座位表</el-button>
        </el-form-item>
        <div class="seat" v-if="seat.length != 0">
          <seat-table-admin :row="formModel.row" :col="formModel.col" :seat="seat"></seat-table-admin>
        </div>

        <el-drawer v-model="drawer2" size="600px" :before-close="handleClose" direction="rtl">
          <template #header><h4>设置座位表</h4></template>
          <template #default>
            <seat-table-admin
              :row="formModel.row"
              :col="formModel.col"
              :seat="tempSeat || setDefaultSeat()"
            ></seat-table-admin>
          </template>
        </el-drawer>

        <el-button class="btn" type="primary" @click="addHall">添加影厅</el-button>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.hallAdd {
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
      .btn1 { padding: 15px; }
    }
  }
}
</style>