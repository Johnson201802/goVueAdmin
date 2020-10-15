import axios from 'axios'
// import {
//   Toast
// } from 'vant'
// create an axios instance

// 调试模式
// const debug = true

// 重新获取token错误码
const tokenErrCode = '1001,1002,1003'

// const service = axios.create({
//   baseURL: 'http://ygb.com/', // url = base url + request url
//   // baseURL: 'http://admin.hatewangluo.com', // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000, // request timeout
//   headers: {
//     'X-Requested-With': 'XMLHttpRequest'
//   }
// })

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers.Authorization = window.localStorage.getItem('token') || ''
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if (debug) console.log(response.request.responseURL,'==>',res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // token过期
      if (tokenErrCode.includes(res.code)) {
        window.localStorage.removeItem('token')
        // window.location.replace(process.env.BASE_URL)
      }
      // Toast(res.msg)
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.msg,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

const customRequest = (params) => {
  return service(params)
}

export default customRequest
