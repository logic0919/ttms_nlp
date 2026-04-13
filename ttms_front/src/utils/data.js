const sort = [
  '全部',
  '爱情',
  '喜剧',
  '动画',
  '剧情',
  '恐怖',
  '惊悚',
  '科幻',
  '动作',
  '悬疑',
  '犯罪',
  '冒险',
  '战争',
  '奇幻',
  '运动',
  '家庭',
  '古装',
  '武侠',
  '西部',
  '历史',
  '传记',
  '歌舞',
  '黑色电影',
  '短片',
  '纪录片',
  '戏曲',
  '音乐',
  '灾难',
  '青春',
  '儿童',
  '其他'
]
const sortToStr = (arr) => {
  // 将一个数字数组转成字符串，对应关系为数组元素在sort数组中的索引，例如[1,2,3]转为"全部 爱情喜剧"
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += sort[arr[i]] + ' '
  }
  return str
}
const findSortIndex = (a) => {
  for (let i = 0; i < sort.length; i++) {
    if (sort[i] === a) {
      return i
    }
  }
}
const theaters = [
  { key: 1, value: 'ACTO梦空间影城' },
  { key: 2, value: 'CGV影城' },
  { key: 3, value: 'M³电影城堡' },
  { key: 4, value: 'SFC上影影城' },
  { key: 5, value: 'SOE太平洋影城' }
]
const findtheaterName = (id) => {
  return theaters.find((item) => item.key === id).value
}
const findtheaterId = (name) => {
  return theaters.find((item) => item.value === name).key
}
// 生成最近三天的时间数据数组
const getDate = (day = 3) => {
  const date = new Date()
  const dateArr = []
  for (let i = 0; i < day; i++) {
    if (i !== 0) {
      date.setDate(date.getDate() + 1)
    }
    const month = date.getMonth() + 1
    const day = date.getDate()
    if (i == 0) {
      dateArr.push({
        str: `今天 ${month}月${day}日`,
        dateid: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
      })
    } else if (i == 1) {
      dateArr.push({
        str: `明天 ${month}月${day}日`,
        dateid: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
      })
    } else if (i == 2) {
      dateArr.push({
        str: `后天 ${month}月${day}日`,
        dateid: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
      })
    } else {
      // 加上星期几的信息
      dateArr.push({
        str: `星期${'日一二三四五六'.charAt(date.getDay())} ${date.getMonth() + 1}月${date.getDate()}日`,
        dateid: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
      })
    }
  }
  return dateArr
}
// 转为年月日时间形式
const formatTime = (time) => {
  // date类型转为2017-01-11 18:44格式
  let date = new Date(time)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return Y + M + D + h + m
}
// 转为年月日形式
const formatDate = (time) => {
  // date类型转为2024-05-30格式
  let date = new Date(time)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  return Y + M + D
}
// 转为时间形式
const formatTime1 = (time) => {
  // date类型转为2024-05-30 18:44:00格式
  let date = new Date(time)
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return h + m
}

export {
  sort,
  theaters,
  findtheaterName,
  findtheaterId,
  getDate,
  formatTime,
  formatDate,
  formatTime1,
  sortToStr,
  findSortIndex
}
