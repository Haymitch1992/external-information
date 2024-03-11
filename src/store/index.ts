// 1.定义状态容器和状态
// 2.修改容器中的state
// 3.仓库中的actions的使用
import { defineStore } from 'pinia'
import { userStore } from './user'

export const mainStore = defineStore('main', {
  state: () => { 
    // 定义状态
    return {
      currentTime:'2023-03-21',
      count: 1,
      currentSelectLineName:'1-八通线',
      phone: '13811559314',
      dialogStatus: false,
      showBuy: false,
      orderFrom: {
        shopping_time: '',
        shopping_name: '',
        shopping_number: "",
        shopping_picture: '',
        visitor_name:''
      },
      order_from_list:[],
      productListData:[
        {
          name: '123',
          price: '123',
          contents: '123',
          count: 1,
          image:''
        }
      ],
      lineList: [
        { label: '1-八通线' },
        { label: '2号线' },
        { label: '5号线' },
        { label: '6号线' },
        { label: '7号线' },
        { label: '8号线' },
        { label: '9号线' },
        { label: '10号线' },
        { label: '11号线' },
        { label: '13号线' },
        { label: '15号线' },
        { label: 'S1线' },
        { label: '昌平线' },
        { label: '亦庄线' },
        { label: '房山线' },
        { label: '首都机场线' },
      ],
      rule: {
        accident: {
          max: 0.3,
          min: 0.1,
          
        }
      },
  

    }
  },
  getters: {
    phoneHidden(state) { 
      return state.phone.toString().replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')
    }
  }, // 监测状态 相当于 computed 计算属性
  actions: {
    changeState() { 
      this.count = 5
      this.phone = '18201193878'
      console.log('打印另一个sotre中的数据',userStore().user_name)
    },
    buildData() { 
      // 调用就会重新刷新数据
      


    }
  } // 操作 相当于 methods 
})