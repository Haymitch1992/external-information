import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'

// create an axios instance
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (window.localStorage.getItem('myToken')) {
      config.headers.Authorization = window.localStorage.getItem('myToken')
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    // 响应做些什么
    if (response.data.code == 5000) {
      ElNotification.error({
        title: '错误',
        message: response.data.message
      })
    } else if (
      response.data.code &&
      response.data.code != 200 &&
      response.data.code != 1 &&
      response.data.code != 5000
    ) {
      // ElNotification.error({
      //     title: '错误',
      //     message: '后端服务异常！'
      // })
    }
    return response
  },
  (err) => {
    // 状态码
    console.log('响应拦截器错误', err)
    switch (err.response.status) {
      case 404:
      case 400:
        ElMessage({ type: 'error', message: '客户端请求有语法错误，不能被服务器所理解' })
        break
      case 403:
        ElMessage.error({ message: '权限不足,请联系管理员!' })
      case 504:
      case 505:
      case 500:
        ElMessage({ type: 'error', message: '服务器状态不可用' })
        // ElNotification.success({
        //     title: '注意',
        //     message: '服务器连接成功！'
        // })
        break
      case 5000:
        ElMessage({ type: 'error', message: '服务器状态未知' })
      default:
        ElMessage.error({ message: '未知错误!' })
    }
  }
)

function apiAxios(method, url, params) {
  return new Promise((resolve, reject) => {
    service({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      dataType: 'json',
      baseURL: axios.default.baseUrl,
      contentType: 'application/json',
      withCredentials: true
    })
      .then((res) => {
        resolve(res)
        // resolve(res.data)
      })
      .catch((err) => {
        ElNotification.error({
          title: '服务器错误',
          message: err.response.data.message
        })
        // ElNotification.error({
        //     title: '警告',
        //     message: '服务器连接超时！尝试重新连接...'
        // })
        // console.log(err.response.data.message);
        reject(err)
      })
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params) {
    return apiAxios('GET', url, params)
  },
  post: function (url, params) {
    return apiAxios('POST', url, params)
  },
  put: function (url, params) {
    return apiAxios('PUT', url, params)
  },
  delete: function (url, params) {
    return apiAxios('DELETE', url, params)
  },
  postUpload: function (url, params) {
    return new Promise((resolve, reject) => {
      // if (params) {
      //   params = filterNull(params)
      // }
      service({
        method: 'POST',
        url: url,
        data: params,
        transformRequest: [
          function (data, headers) {
            // 去除post请求默认的Content-Type
            delete headers.post['Content-Type']
            return data
          }
        ],
        baseURL: axios.default.baseUrl,
        withCredentials: true
      })
        .then((res) => {
          resolve(res)
          // resolve(res.data)
        })
        .catch((err) => {
          ElNotification.error({
            title: '服务器错误',
            message: err.response.data.message
          })
          reject(err)
        })
    })
  },
  getDownload: function (url, params) {
    return new Promise((resolve, reject) => {
      // if (params) {
      //   params = filterNull(params)
      // }
      service({
        method: 'GET',
        url: url,
        data: params,
        headers: {
          xxxx: 'xxxx'
        },
        responseType: 'blob',
        baseURL: axios.default.baseUrl,
        withCredentials: true
      })
        .then((res) => {
          resolve(res)
          // resolve(res.data)
        })
        .catch((err) => {
          ElNotification.error({
            title: '服务器错误',
            message: err.response.data.message
          })
          reject(err)
        })
    })
  }
}
