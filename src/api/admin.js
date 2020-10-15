import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/admin/getAdminList', // vue-element-admin/article/list
    method: 'get',
    params: query
  })
}

export function groupList() {
  return request({
    url: 'admin/admin/getGroupList', // vue-element-admin/article/list
    method: 'get'
  })
}

export function delAdmin(id) {
  return request({
    url: 'admin/admin/delAdmin',
    method: 'delete',
    params: { id }
  })
}

export function createAdmin(data) {
  return request({
    url: 'admin/admin/createAdmin',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: 'admin/admin/updateAdmin',
    method: 'post',
    data
  })
}
