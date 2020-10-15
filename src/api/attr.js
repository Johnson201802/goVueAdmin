import request from '@/utils/request'

export function fetchAttrList(query) {
  return request({
    url: 'admin/admin/fetchAttrList',
    method: 'get',
    params: query
  })
}

export function createAttr(query) {
  return request({
    url: 'admin/admin/createAttr',
    method: 'post',
    params: query
  })
}

export function updateAttr(data) {
  return request({
    url: 'admin/admin/updateAttr',
    method: 'post',
    data
  })
}

export function delAttr(id) {
  return request({
    url: `admin/admin/delAttr`,
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

export function getAttr() {
  return request({
    url: `admin/admin/getAttr`,
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
