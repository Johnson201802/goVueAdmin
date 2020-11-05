import request from '@/utils/request'

export function getServer() {
  return request({
    url: 'serverInfo', // vue-element-admin/article/list
    method: 'get'
  })
}

