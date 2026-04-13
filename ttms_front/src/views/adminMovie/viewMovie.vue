<script setup>
// import { movieAddService } from '@/api/movie'
import { movieAddService } from '@/api/movie'
import { sort, formatDate } from '@/utils/data'
import { ref, nextTick } from 'vue'
// 关于类型标签的部分
const onChange = (i) => {
  refs.value[i] = !refs.value[i]
}
sort.shift()
const refs = ref(new Array(length).fill(false))
let resCateArr = []
// 在提交的时候才执行这个函数，用于生成tag数组
const getResCateArr = () => {
  for (let i = 0; i < sort.length; i++) {
    if (refs.value[i] === true) {
      resCateArr.push(i + 1 + '')
    }
  }
}
// 关于表单
const formModel = ref({
  name: '',
  engName: '',
  area: '',
  date: '',
  duration: '',
  intro: ''
})
const form = ref(null)
const rules = ref({
  name: [{ required: true, message: '请输入电影中文名称', trigger: 'blur' }],
  engName: [{ required: true, message: '请输入电影英文名称', trigger: 'blur' }],
  area: [{ required: true, message: '请输入电影地区', trigger: 'blur' }],
  date: [{ required: true, message: '请输入电影上映时间', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入电影时长', trigger: 'blur' }],
  intro: [{ required: true, message: '请输入电影简介', trigger: 'blur' }]
})
// 关于导演输入
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
// 关于演员输入
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
const carouse = ref([])
console.log(formatDate(formModel.value.date))
const addMovie = async () => {
  await form.value.validate()
  const res = movieAddService({
    chinese_name: formModel.value.name,
    english_name: formModel.value.engName,
    category_id: getResCateArr(),
    area: formModel.value.area,
    show_time: formModel.value.date,
    duration: formModel.value.duration,
    directors: dynamicTags.value,
    actors: dynamicTags1.value,
    introduction: formModel.value.intro
    // movie_img: obj.movie_img,
    // director_img: obj.director_img,
    // actor_img: obj.actor_img
  })
  if (res.status === 200) {
    carouse.value = res.data.data.item
  } else {
    ElMessage.error('轮播图失败')
  }
}
// 关于图片上传
import { Plus } from '@element-plus/icons-vue'

// import { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  },
  {
    name: 'haha.jpg',
    url: 'https://element-plus.org/images/plant-1.png'
  }
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
</script>

<template>
  <div class="viewMovie">
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
          <el-input
            v-model="formModel.duration"
            placeholder="请输入影片时长"
          /><template #append>分钟</template>
        </el-form-item>
        <el-form-item label="上映日期" class="form-item" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="formModel.date"
                type="date"
                aria-label="Pick a date"
                placeholder="请选择上映日期"
                style="width: 100%"
              />
            </el-form-item>
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
            >
              + 导演
            </el-button>
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
            >
              + 演员
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="影片图集" class="form-item">
          <el-upload
            v-model:file-list="fileList"
            @click="test2"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :submit="test"
            :handleStart="test1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
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
.viewMovie {
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
    }
  }
}
</style>
