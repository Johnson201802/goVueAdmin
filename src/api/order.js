import request from '@/utils/request'

export function fetchCashOutList(query) {
  return request({
    url: 'admin/admin/fetchCashOutList',
    method: 'get',
    params: query
  })
}

export function fetchLineChartData() {
  return request({
    url: 'admin/admin/getHDinfo',
    method: 'get'
  })
}

export function getPostInfo(id) {
  return request({
    url: 'admin/admin/getPostInfo',
    method: 'get',
    params: {id:id}
  })
}

export function fetchOrderList(query) {
  return request({
    url: '/fetchOrderList',
    method: 'get',
    params: query
  })
}

export function fetchOrderList2(query) {
  return request({
    url: 'admin/admin/fetchOrderList2',
    method: 'get',
    params: query
  })
}

export function getBuRegisterConfigList(query) {
  return request({
    url: 'admin/admin/getBuRegisterConfigList',
    method: 'get',
    params: query
  })
}

export function getRegisterConfigList(query) {
  return request({
    url: 'admin/admin/getRegisterConfigList',
    method: 'get',
    params: query
  })
}

export function giveBack(id) {
  return request({
    url: `index/pay/refund`,
    method: 'post',
    params: { id: id }
  })
}

export function checkOut(id) {
  return request({
    url: `admin/admin/checkOut`,
    method: 'post',
    params: { id: id }
  })
}

export function delOrder(id) {
  return request({
    url: `/delOrder`,
    method: 'post',
    params: { id: id }
  })
}

export function delUserOrder(id) {
  return request({
    url: `admin/admin/delUserOrder`,
    method: 'post',
    params: { id: id }
  })
}

export function getFYinfo(id) {
  return request({
    url: `admin/admin/getFYinfo2`,
    method: 'post',
    params: { id: id }
  })
}

export function postOrder(id,postNum) {
  return request({
    url: `admin/admin/postOrder`,
    method: 'get',
    params: { id: id,postNum:postNum }
  })
}

export function delOrder2(id) {
  return request({
    url: `admin/admin/delOrder2`,
    method: 'post',
    params: { id: id }
  })
}

export function getVipConfigList(id) {
  return request({
    url: `admin/admin/getVipConfigList`,
    method: 'post'
  })
}

export function createVipConfig(data) {
  return request({
    url: `admin/admin/createVipConfig`,
    method: 'post',
    data
  })
}

export function createBuRegisterConfig(data) {
  return request({
    url: `admin/admin/createBuRegisterConfig`,
    method: 'post',
    data
  })
}

export function createRegisterConfigList(data) {
  return request({
    url: `admin/admin/createRegisterConfigList`,
    method: 'post',
    data
  })
}

export function delVipConfig(id) {
  return request({
    url: `admin/admin/deleteVipCountConfig`,
    method: 'post',
    params:{id:id}
  })
}

export function delRegisterConfigList(id) {
  return request({
    url: `admin/admin/delRegisterConfigList`,
    method: 'post',
    params:{id:id}
  })
}

export function delBuRegisterConfig(id) {
  return request({
    url: `admin/admin/delBuRegisterConfig`,
    method: 'post',
    params:{id:id}
  })
}

export function updateVipConfig(data) {
  return request({
    url: `admin/admin/updateVipConfig`,
    method: 'post',
    data
  })
}

export function updateRegisterConfigList(data) {
  return request({
    url: `admin/admin/updateRegisterConfigList`,
    method: 'post',
    data
  })
}

export function updateBuRegisterConfig(data) {
  return request({
    url: `admin/admin/updateBuRegisterConfig`,
    method: 'post',
    data
  })
}

export function getVipCountConfigList(query) {
  return request({
    url: 'admin/admin/getVipCountConfigList',
    method: 'get',
    params: query
  })
}

export function createVipCountConfig(data) {
  return request({
    url: `admin/admin/createVipCountConfig`,
    method: 'post',
    data
  })
}

export function updateVipCountConfig(data) {
  return request({
    url: `admin/admin/updateVipCountConfig`,
    method: 'post',
    data
  })
}
