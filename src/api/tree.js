import request from '@/utils/request'

export function fetchTreeConfigList(query) {
  return request({
    url: 'admin/admin/fetchTreeConfigList',
    method: 'get',
    params: query
  })
}

export function createTreeConfig(query) {
  return request({
    url: 'admin/admin/createTreeConfig',
    method: 'post',
    params: query
  })
}

export function updateTreeConfig(query) {
  return request({
    url: 'admin/admin/updateTreeConfig',
    method: 'post',
    params: query
  })
}

export function delTreeConfig(id) {
  return request({
    url: 'admin/admin/delTreeConfig',
    method: 'post',
    params: {'id':id}
  })
}
