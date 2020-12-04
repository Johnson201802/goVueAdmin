import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/getAdminList', // vue-element-admin/article/list
    method: 'get',
    params: query
  })
}

export function groupList() {
  return request({
    url: '/getGroupList', // vue-element-admin/article/list
    method: 'get'
  })
}

export function delAdmin(id) {
  return request({
    url: '/delAdmin',
    method: 'delete',
    params: { id }
  })
}

export function createAdmin(data) {
  return request({
    url: '/createAdmin',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/updateAdmin',
    method: 'post',
    data
  })
}
