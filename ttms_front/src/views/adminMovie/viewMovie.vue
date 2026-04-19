<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { movieGetInfoService } from '@/api/movie'
import { sort, sortToStr } from '@/utils/data'

const route = useRoute()
const movie_id = route.params.id

const movieData = ref(null)
const loading = ref(true)

// 将 category_ids 字符串（如 "0,1,3"）转为类型标签名称字符串
const getCategoryNames = (categoryIds) => {
  if (!categoryIds) return '未知'
  const ids = categoryIds.split(',').map(Number).filter(id => id > 0)
  return ids.map(id => sort[id] || '').filter(Boolean).join(' / ') || '暂无'
}

// 新后端：GET /movie/seabyid?movie_id=xxx → { success, data: [movie] }（数组取第一个）
onMounted(async () => {
  try {
    const res = await movieGetInfoService(movie_id)
    const data = res.data.data
    movieData.value = Array.isArray(data) ? data[0] : data
  } catch (e) {
    ElMessage.error('获取电影信息失败')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="viewMovie">
    <div class="main">
      <div v-if="loading" style="text-align:center; padding: 60px">
        <el-loading></el-loading>
        <p>加载中...</p>
      </div>
      <div v-else-if="!movieData">
        <el-empty description="未找到该影片信息"></el-empty>
      </div>
      <div v-else class="detail">
        <div class="cover">
          <img :src="movieData.movie_img" alt="封面" />
        </div>
        <el-descriptions title="影片详情" :column="1" border class="desc">
          <el-descriptions-item label="影片ID">{{ movieData.movie_id }}</el-descriptions-item>
          <el-descriptions-item label="中文名称">{{ movieData.chinese_name }}</el-descriptions-item>
          <el-descriptions-item label="英文名称">{{ movieData.english_name }}</el-descriptions-item>
          <el-descriptions-item label="上映地区">{{ movieData.area }}</el-descriptions-item>
          <el-descriptions-item label="上映日期">{{ movieData.show_time }}</el-descriptions-item>
          <el-descriptions-item label="影片时长">{{ movieData.duration }} 分钟</el-descriptions-item>
          <el-descriptions-item label="类型标签">{{ getCategoryNames(movieData.category_ids) }}</el-descriptions-item>
          <el-descriptions-item label="导演">{{ movieData.directors }}</el-descriptions-item>
          <el-descriptions-item label="演员">{{ movieData.actors }}</el-descriptions-item>
          <el-descriptions-item label="剧情简介">{{ movieData.introduction }}</el-descriptions-item>
        </el-descriptions>
        <div class="imgs">
          <div class="img-item" v-if="movieData.director_img">
            <p>导演图片</p>
            <img :src="movieData.director_img" alt="导演" />
          </div>
          <div class="img-item" v-if="movieData.actor_img">
            <p>演员图片</p>
            <img :src="movieData.actor_img" alt="演员" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.viewMovie {
  width: 80%;
  margin: 0 auto;
  .main {
    .detail {
      padding: 30px 0;
      .cover {
        margin-bottom: 30px;
        img { height: 300px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
      }
      .desc { margin-bottom: 30px; }
      .imgs {
        display: flex;
        gap: 30px;
        margin-top: 20px;
        .img-item {
          p { font-size: 14px; color: #666; margin-bottom: 8px; }
          img { height: 180px; border-radius: 4px; border: 2px solid #eee; }
        }
      }
    }
  }
}
</style>