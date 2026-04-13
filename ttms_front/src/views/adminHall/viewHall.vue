<script setup>
import { ref, provide, onMounted } from 'vue'
import { hallGetService, hallChangeService } from '@/api/hall'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.params.id
const theater_id = route.params.theater_id
// 关于表单
const formModel = ref({
  name: '',
  col: '',
  row: ''
})
const form = ref(null)
const rules = ref({
  name: [{ required: true, message: '请输入影厅名', trigger: 'blur' }],
  row: [{ required: true, message: '请输入影厅座位行数', trigger: 'blur' }],
  col: [{ required: true, message: '请输入影厅座位列数', trigger: 'blur' }]
})
// 关于真实的数据
const trueInfo = ref({
  name: '',
  col: '2',
  row: '2'
})
const seat = ref([])
let realSeat = []
const trueSeat = ref([])
const copyArr = (originalArray) => {
  let newArray = []
  for (let i = 0; i < originalArray.length; i++) {
    newArray[i] = [] // 为新数组创建新的子数组
    for (let j = 0; j < originalArray[i].length; j++) {
      newArray[i][j] = originalArray[i][j] // 复制元素
    }
  }
  return newArray
}
const getInfo = async () => {
  const res = await hallGetService(id)
  if (res.data.status === 200) {
    const data = res.data.data
    // 赋值给存储真实数据的变量
    trueInfo.value.name = data.Name
    trueInfo.value.row = data.SeatRow
    trueInfo.value.col = data.SeatColumn
    trueSeat.value = copyArr(data.Seat)
    realSeat = copyArr(trueSeat.value)
    // 赋值给用于修改时展示数据的变量
    toTemp()
  } else {
    ElMessage({ message: '演出厅列表获取失败', type: 'error' })
  }
}
// 把真实值的值赋值给暂时值也就是formModel
const toTemp = () => {
  formModel.value.col = trueInfo.value.col
  formModel.value.row = trueInfo.value.row
  formModel.value.name = trueInfo.value.name
  seat.value = copyArr(trueSeat.value)
}
onMounted(() => {
  getInfo()
})
// isChange控制当前是查看还是修改
const isChange = ref(false)
const switchOpea = (a) => {
  isChange.value = a
}
const drawer2 = ref(false)
// 打开抽屉
// 如果此时输入框中的行列数和真实的行列数一致，那么把真实的座位数组赋值给seat用于切换座位状态
// 如果不一致，就调用生成默认数组的方法
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
    formModel.value.row === trueSeat.value.length &&
    Number(formModel.value.col) === trueSeat.value[0].length
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
// 暂时的座位数组，用于在抽屉中展示
// 每次打开抽屉，先判断seat是否为空，如果为空，则调用setDefaultSeat方法，生成默认的座位状态数组，并赋值给tempSeat
// 如果不为空，则直接把seat赋值给tempSeat
// 关抽屉时，把tempSeat赋值给seat
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
const changeHall = async () => {
  // 需要先拦截掉边缘情况
  await form.value.validate()
  if (Number(formModel.value.row) === 0 || Number(formModel.value.col) === 0) {
    ElMessage.warning('请输入合适的行数和列数')
    return
  }
  if (
    Number(formModel.value.row) !== trueSeat.value.length ||
    Number(formModel.value.col) !== trueSeat.value[0].length
  ) {
    ElMessage.warning('输入的行列数和设置的座位表的行列数不一致')
    return
  }

  const res = await hallChangeService({
    id: Number(id),
    name: formModel.value.name,
    seat_row: Number(formModel.value.row),
    seat_column: Number(formModel.value.col),
    seat: getSeatStr(),
    theater_id: Number(theater_id)
  })
  if (res.data.status === 200) {
    ElMessage({ message: '修改影厅成功', type: 'success' })
    const data = res.data.data
    trueInfo.value.col = data.Name
    trueInfo.value.row = data.SeatRow
    trueInfo.value.name = data.SeatColumn
    trueSeat.value = copyArr(data.Seat)
    realSeat = copyArr(data.Seat)
    switchOpea(false)
  } else {
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
          <el-input
            v-model="formModel.name"
            :disabled="!isChange"
            placeholder="请输入影厅名"
          />
        </el-form-item>
        <el-form-item label="行数" prop="row" class="form-item">
          <el-input
            v-model="formModel.row"
            :disabled="!isChange"
            placeholder="请输入座位行数"
          />
        </el-form-item>
        <el-form-item label="列数" prop="col" class="form-item">
          <el-input
            v-model="formModel.col"
            :disabled="!isChange"
            placeholder="请输入座位列数"
          />
        </el-form-item>
        <el-form-item label="座位表" class="form-item" required>
          <el-button
            type="primary"
            class="btn1"
            :disabled="!isChange"
            plain
            @click="setSeat()"
            >设置座位表</el-button
          >
        </el-form-item>
        <div class="seat" v-if="trueSeat.length != 0">
          <seat-table-admin
            :row="trueSeat.row"
            :col="trueSeat.col"
            :seat="trueSeat"
          ></seat-table-admin>
        </div>

        <el-drawer
          v-model="drawer2"
          size="600px"
          title="请选择座位和过道"
          :before-close="handleClose"
          direction="rtl"
        >
          <template #header>
            <h4>设置座位表</h4>
          </template>
          <template #default>
            <!-- 展示seat或者默认 -->
            <!-- 如果seat不是空数组，说明没有修改行数和列数 -->
            <seat-table-admin
              :row="formModel.row"
              :col="formModel.col"
              :seat="seat"
            ></seat-table-admin>
          </template>
        </el-drawer>

        <el-button
          class="btn"
          type="primary"
          v-if="!isChange"
          @click="switchOpea(true)"
          >修改影厅</el-button
        >
        <div class="btnGro">
          <el-button
            class="btn"
            type="primary"
            v-if="isChange"
            @click="changeHall"
            >保存修改</el-button
          >
          <el-button
            class="btn"
            type="primary"
            v-if="isChange"
            @click="cancle()"
            >取消</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
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
        justify-content: space-around;
        margin: 70px 100px;
        .btn {
          width: 40%;
          margin: 0px;
          margin-left: 70px;
        }
      }
      .btn1 {
        padding: 15px;
      }
    }
  }
}
</style>
