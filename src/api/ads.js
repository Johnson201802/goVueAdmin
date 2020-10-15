import request from '@/utils/request'

export function fetchCateList(query) {
  return request({
    url: 'admin/admin/fetchCateList',
    method: 'get',
    params: query
  })
}

export function createAdsCate(query) {
  return request({
    url: 'admin/admin/createAdsCate',
    method: 'post',
    params: query
  })
}

export function updateAdsCate(data) {
  return request({
    url: 'admin/admin/updateAdsCate',
    method: 'post',
    data
  })
}

export function delAdsCate(id) {
  return request({
    url: `admin/admin/delAdsCate`,
    method: 'delete',
    params: { id: id }
  })
}

export function fetchAdsList(query) {
  return request({
    url: `admin/admin/fetchAdsList`,
    method: 'get',
    params: query
  })
}

export function sort(data) {
  return request({
    url: `admin/admin/sort`,
    method: 'post',
    data
  })
}

export function changeStatus(id, status) {
  return request({
    url: `admin/admin/changeStatus`,
    method: 'post',
    params: { id: id, status: status }
  })
}

export function getCateList() {
  return request({
    url: `admin/admin/getCateList`,
    method: 'get'
  })
}

export function createAds(data) {
  return request({
    url: `admin/admin/createAds`,
    method: 'post',
    data
  })
}

export function updateAds(data) {
  return request({
    url: `admin/admin/updateAds`,
    method: 'post',
    data
  })
}

export function delAds(id) {
  return request({
    url: `admin/admin/delAds`,
    method: 'post',
    params: { id: id }
  })
}
