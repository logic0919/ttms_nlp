<script setup>
import { movieAddService } from '@/api/movie'
import { sort, formatDate } from '@/utils/data'
import { ref, nextTick } from 'vue'

const onChange = (i) => {
  refs.value[i] = !refs.value[i]
}
sort.shift()
const refs = ref(new Array(sort.length).fill(false))

const formModel = ref({
  name: '',
  engName: '',
  area: '',
  date: '',
  duration: '',
  intro: ''
})

const fileList1 = ref([])
const fileList2 = ref([])
const fileList3 = ref([])

const form = ref(null)

const rules = ref({
  name: [{ required: true, message: '请输入影片名', trigger: 'blur' }]
})

// 导演
const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref()
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 演员
const inputValue1 = ref('')
const dynamicTags1 = ref([])
const inputVisible1 = ref(false)
const InputRef1 = ref()
const handleClose1 = (tag) => {
  dynamicTags1.value.splice(dynamicTags1.value.indexOf(tag), 1)
}
const showInput1 = () => {
  inputVisible1.value = true
  nextTick(() => {
    InputRef1.value.input.focus()
  })
}
const handleInputConfirm1 = () => {
  if (inputValue1.value) {
    dynamicTags1.value.push(inputValue1.value)
  }
  inputVisible1.value = false
  inputValue1.value = ''
}

const refsToArr = (obj) => {
  const arr = []
  for (const key in obj) {
    if (obj[key]) arr.push(Number(key) + 1)
  }
  return arr
}

const handleFileChange1 = (file, fileList) => {
  fileList1.value = fileList.map((f) => f.raw)
}
const handleFileChange2 = (file, fileList) => {
  fileList2.value = fileList.map((f) => f.raw)
}
const handleFileChange3 = (file, fileList) => {
  fileList3.value = fileList.map((f) => f.raw)
}

const addMovie = async () => {
  try {
    await form.value.validate()
  } catch (e) {
    ElMessage.warning('请输入影片名')
    return
  }

  const date = formatDate(formModel.value.date).trim()

  const fd = new FormData()
  fd.append('chinese_name', formModel.value.name)
  fd.append('english_name', formModel.value.engName)
  fd.append('category_ids', refsToArr(refs.value).join(','))
  fd.append('area', formModel.value.area)
  fd.append('show_time', date)
  fd.append('duration', formModel.value.duration)
  fd.append('directors', dynamicTags.value.join(','))
  fd.append('actors', dynamicTags1.value.join(','))
  fd.append('introduction', formModel.value.intro)

  fileList1.value.forEach((file) => fd.append('movie_img', file))
  fileList2.value.forEach((file) => fd.append('director_img', file))
  fileList3.value.forEach((file) => fd.append('actor_img', file))

  try {
    const res = await movieAddService(fd)
    console.log(res)
    ElMessage.success('影片创建成功')
  } catch (e) {
    ElMessage.error('影片创建失败')
  }
}
</script>

<template>
  <div class="movieAdd">
    <div class="main">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm form"
        status-icon
      >
        <el-form-item label="影片名" prop="name" class="form-item">
          <el-input v-model="formModel.name" placeholder="请输入影片名" />
        </el-form-item>
        <el-form-item label="英文名" prop="engName" class="form-item">
          <el-input v-model="formModel.engName" placeholder="请输入英文名" />
        </el-form-item>
        <el-form-item label="上映区域" prop="area" class="form-item">
          <el-input v-model="formModel.area" placeholder="请输入上映区域" />
        </el-form-item>
        <el-form-item label="影片时长" prop="duration" class="form-item">
          <el-input v-model="formModel.duration" placeholder="请输入影片时长" />
          <template #append>分钟</template>
        </el-form-item>
        <el-form-item label="上映日期" prop="date" class="form-item">
          <el-col :span="11">
            <el-date-picker
              v-model="formModel.date"
              type="date"
              placeholder="请选择上映日期"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="剧情简介" prop="intro" class="form-item">
          <el-input
            v-model="formModel.intro"
            placeholder="请输入剧情简介"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="类型标签" class="form-item">
          <div class="tags">
            <el-check-tag
              class="tag"
              :checked="refs[index]"
              type="danger"
              v-for="(i, index) in sort"
              :key="i"
              @change="onChange(index)"
              >{{ i }}</el-check-tag
            >
          </div>
        </el-form-item>
        <el-form-item label="导演" class="form-item">
          <div class="flex gap-2 tags">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              class="tag"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="w-20"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button
              v-else
              class="button-new-tag tag"
              size="small"
              @click="showInput"
              >+ 导演</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="演员" class="form-item">
          <div class="flex gap-2 tags">
            <el-tag
              v-for="tag in dynamicTags1"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose1(tag)"
              class="tag"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible1"
              ref="InputRef1"
              v-model="inputValue1"
              class="w-20"
              size="small"
              @keyup.enter="handleInputConfirm1"
              @blur="handleInputConfirm1"
            />
            <el-button
              v-else
              class="button-new-tag tag"
              size="small"
              @click="showInput1"
              >+ 演员</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="影片图集" class="form-item">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            multiple
            :on-change="handleFileChange1"
          >
            <el-button size="small" plain style="width: 60px" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="导演图片" class="form-item">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            multiple
            :on-change="handleFileChange2"
          >
            <el-button size="small" plain style="width: 60px" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item label="演员图片" class="form-item">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            multiple
            :on-change="handleFileChange3"
          >
            <el-button size="small" plain style="width: 60px" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-button class="btn" type="primary" @click="addMovie"
          >添加电影</el-button
        >
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
.movieAdd {
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
    }
  }
}
</style>
