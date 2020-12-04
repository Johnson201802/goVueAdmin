import request from '@/utils/request'

export function delCache() {
  return request({
    url: 'admin/admin/delCache', // vue-element-admin/article/list
    method: 'get'
  })
}

export function serve_info() {
  return request({
    url: 'admin/admin/serve_info', // vue-element-admin/article/list
    method: 'get'
  })
}

export function loginLog() {
  return request({
    url: 'admin/admin/login_log', // vue-element-admin/article/list
    method: 'get'
  })
}

export function cardData() {
  return request({
    url: 'admin/admin/cardData', // vue-element-admin/article/list
    method: 'get'
  })
}

export function getNewMsg() {
  return request({
    url: '/getNewMsg', // vue-element-admin/article/list
    method: 'get'
  })
}