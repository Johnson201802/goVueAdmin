import request from '@/utils/request'

export function fetchMerchantList(page,limit,title) {
  return request({
    url: '/fetchMerchantList',
    method: 'get',
    params: {page:page,limit:limit,title:title}
  })
}

export function sortMerchant(id, sort) {
  return request({
    url: 'admin/admin/sortMerchant',
    method: 'get',
    params: { id: id, sort: sort }
  })
}

export function changeMerchantStatus(id, status) {
  return request({
    url: 'admin/admin/changeMerchantStatus',
    method: 'post',
    params: { id: id, status: status }
  })
}

export function changeMerchantFee(id, status) {
  return request({
    url: 'admin/admin/changeMerchantFee',
    method: 'post',
    params: { id: id, status: status }
  })
}

export function createMerchant(data) {
  return request({
    url: '/createMerchant',
    method: 'POST',
    data
  })
}

export function delMerchant(id) {
  return request({
    url: '/delMerchant',
    method: 'post',
    params: { id: id }
  })
}

export function fetchOneMerchant(id) {
  return request({
    url: '/fetchOneMerchant',
    method: 'get',
    params: { id: id }
  })
}

export function updateMerchant(data) {
  return request({
    url: '/updateMerchant',
    method: 'post',
    data
  })
}
