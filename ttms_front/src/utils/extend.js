// 提示框、确认框等的封装
// 加载loading
// 消息提示message(!!!)
// 消息弹出框message box（只有确认按钮）(!!!)
import { ElMessage, ElMessageBox } from 'element-plus'
const myMessage = (msg, type = 'success') =>
  ElMessage({
    message: msg,
    type
  })

const myMessageBox = (title, resFun) => {
  ElMessageBox.confirm(title)
    .then(() => {
      resFun()
    })
    .catch(() => {
      // catch error
    })
}
export { myMessage, myMessageBox }
