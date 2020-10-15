import request from '@/utils/request'

export function fetchPresentList(query) {
  return request({
    url: 'admin/admin/fetchPresentList',
    method: 'get',
    params: query
  })
}

export function getOneCompany(id) {
  return request({
    url: 'admin/admin/getOneCompany',
    method: 'get',
    params: { id: id }
  })
}

export function createPresent(data) {
  return request({
    url: 'admin/admin/createPresent',
    method: 'post',
    data
  })
}

export function delPresent(id) {
  return request({
    url: `admin/admin/delPresent`,
    method: 'delete',
    params: { id: id }
  })
}

export function updatePresent(data) {
  return request({
    url: `admin/admin/updatePresent`,
    method: 'post',
    data
  })
}

