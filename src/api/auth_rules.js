import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'getAuthList', // vue-element-admin/article/list
    method: 'get',
    params: query
  })
}

export function delRule(id) {
  return request({
    url: 'delRule',
    method: 'delete',
    params: { id }
  })
}

export function createRule(data) {
  return request({
    url: 'createRule',
    method: 'post',
    data
  })
}

export function updateRule(data) {
  return request({
    url: 'updateRule',
    method: 'post',
    data
  })
}
