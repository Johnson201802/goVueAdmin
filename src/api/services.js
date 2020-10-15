import request from '@/utils/request'

export function fetchPresentConfigList(query) {
  return request({
    url: 'admin/admin/fetchPresentConfigList',
    method: 'get',
    params: query
  })
}

export function createPresentConfigList(query) {
  return request({
    url: 'admin/admin/createPresentConfigList',
    method: 'post',
    params: query
  })
}

export function updatePresentConfigList(data) {
  return request({
    url: 'admin/admin/updatePresentConfigList',
    method: 'post',
    data
  })
}

export function delPresentConfig(id) {
  return request({
    url: `admin/admin/delPresentConfig`,
    method: 'delete',
    params: { id: id }
  })
}

export function changeServiceCateStatus(id, status) {
  return request({
    url: `admin/admin/changeServiceCateStatus`,
    method: 'post',
    params: { id: id, status: status }
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

export function sortGiftConfig(id, sort) {
  return request({
    url: `admin/admin/sortGiftConfig`,
    method: 'GET',
    params: { id: id, sort: sort }
  })
}
