import request from '@/utils/request'

export function fetchServicesList(query) {
  return request({
    url: '/fetchServicesList',
    method: 'get',
    params: query
  })
}

export function changeStatus(id,is_sale) {
  return request({
    url: '/changeStatus',
    method: 'POST',
    params: {"id":id,"is_sale":is_sale}
  })
}

export function createService(data) {
  return request({
    url: '/createService',
    method: 'post',
    data
  })
}

export function getMerchant() {
  return request({
    url: '/getMerchant',
    method: 'GET'
  })
}

export function updateService(data) {
  return request({
    url: '/updateService',
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


export function getCardList() {
  return request({
    url: `getCardList`,
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

export function updateCard(data) {
  return request({
    url: `/updateCard`,
    method: 'POST',
    data
  })
}

export function changeStatus2(id,status) {
  return request({
    url: `/changeStatus2`,
    method: 'GET',
    params:{id : id, status : status}
  })
}
