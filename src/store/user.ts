// 1.定义状态容器和状态
// 2.修改容器中的state
// 3.仓库中的actions的使用
import { defineStore } from 'pinia'

export const userStore = defineStore('userStore', {
  state: () => { 
    // 定义状态
    return {
      user_name: '',
      user_token:'d53b12c4-5e7d-4db8-bb0d-ae17e1b9963d', 
      user_email: '',
      role:'3', // 1普通用户 2 管理员 3 超级管理员
      user_id: '2',
      menuDialogShow: false, // 顶部菜单对话框状态
      dialogModelType: 1 ,//1 登录 2 注册 3 忘记密码 
      cipher: '',
      imageOrText: false,
    }
  },
  getters: {
  }, // 监测状态 相当于 computed 计算属性
  actions: {
    
  } // 操作 相当于 methods 
})

// 保存数据
const instance = userStore()
instance.$subscribe((_, state) => { 
  localStorage.setItem('login-store', JSON.stringify({ ...state }))
})

// 获取数据
const old = localStorage.getItem('login-store')
if (old) { 
  instance.$state=JSON.parse(old)
}