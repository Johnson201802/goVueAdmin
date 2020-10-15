import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/admin/getAuthList', // vue-element-admin/article/list
    method: 'get',
    params: query
  })
}

export function delRule(id) {
  return request({
    url: 'admin/admin/delRule',
    method: 'delete',
    params: { id }
  })
}

export function createRule(data) {
  return request({
    url: 'admin/admin/createRule',
    method: 'post',
    data
  })
}

export function updateRule(data) {
  return request({
    url: 'admin/admin/updateRule',
    method: 'post',
    data
  })
}
