import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: 'admin/admin/getRuleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: 'admin/admin/getRoleList',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: 'admin/admin/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `admin/admin/updateRole`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `admin/admin/delRole`,
    method: 'delete',
    params: id
  })
}

export function getOneRole(data) {
  return request({
    url: 'admin/admin/getOneRole',
    method: 'get',
    params: data
  })
}
