// 验证工具函数（从原来的regular.js重构）
const telReg = /^[0-9]{11}$/
const pwdReg = /^\w{6,16}$/
const QQReg = /^[0-9]{2,20}$/
const nameReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,11}$/

/**
 * 用户信息验证
 * @param {Object} params - { flag, tel, pwd, QQ, name }
 * @returns {Object} { inf: boolean, msg: string }
 */
const infoRegTest = ({ flag, tel, pwd, QQ, name }) => {
    if (flag === 0) {
        if (!QQ) {
            return {
                inf: false,
                msg: 'QQ号格式不正确'
            }
        }
        if (!name) {
            return {
                inf: false,
                msg: '姓名必须2至10位中文字符'
            }
        }
    }
    if (!telReg.test(tel)) {
        return {
            inf: false,
            msg: '手机号应为11位数字'
        }
    }
    if (!pwdReg.test(pwd)) {
        return {
            inf: false,
            msg: '密码应为6至15位字母数字下划线'
        }
    }
    if (QQ && !QQReg.test(QQ)) {
        return {
            inf: false,
            msg: 'QQ号格式不正确'
        }
    }
    if (name && !nameReg.test(name)) {
        return {
            inf: false,
            msg: '姓名应为2至10位中文字符'
        }
    }
    return {
        inf: true,
        msg: '报名或登录信息格式无误'
    }
}

module.exports = {
    infoRegTest,
    telReg,
    pwdReg,
    QQReg,
    nameReg
}