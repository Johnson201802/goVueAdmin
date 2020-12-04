import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/getRuleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/getRoleList',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: '/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/updateRole`,
    method: 'POST',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/delRole`,
    method: 'delete',
    params: {id:id}
  })
}

export function getOneRole(data) {
  return request({
    url: '/getOneRole',
    method: 'get',
    params: data
  })
}
