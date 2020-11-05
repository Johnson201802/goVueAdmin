import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'adminLogin',
    method: 'post',
    params:{
      "username":data.username,
      "password":data.password
    }
  })
}

export function getInfo() {
  return request({
    url: 'getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
