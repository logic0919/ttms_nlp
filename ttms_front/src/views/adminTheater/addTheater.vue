<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const formModel = ref({
  name: '',
  place: ''
})
const form = ref(null)
const rules = ref({
  name: [{ required: true, message: '请输入影院名称', trigger: 'blur' }],
  place: [{ required: true, message: '请输入影院地址', trigger: 'blur' }]
})

const addTheater = async () => {
  await form.value.validate()
  // 后端暂未提供影院管理接口，此处为预留页面
  ElMessage({ message: '影院信息已记录（后端接口待接入）', type: 'info' })
}
</script>

<template>
  <div class="addtheater">
    <div class="main">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm form"
        status-icon
      >
        <el-form-item label="影院名称" prop="name" class="form-item" required>
          <el-input v-model="formModel.name" placeholder="请输入影院名称" />
        </el-form-item>
        <el-form-item label="影院地址" prop="place" class="form-item" required>
          <el-input v-model="formModel.place" placeholder="请输入影院地址" />
        </el-form-item>
        <el-button class="btn" type="primary" @click="addTheater">添加影院</el-button>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.addtheater {
  width: 60%;
  margin: 0 auto;
  .main {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .form {
      width: 100%;
      .form-item {
        margin-top: 80px;
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