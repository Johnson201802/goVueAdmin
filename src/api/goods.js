import request from '@/utils/request'

export function fetchGoodsList(query) {
  return request({
    url: 'admin/admin/fetchGoodsList',
    method: 'get',
    params: query
  })
}

export function sortGoods(id, sort) {
  return request({
    url: 'admin/admin/sortGoods',
    method: 'get',
    params: { id: id, sort: sort }
  })
}

export function changeGoodsStatus(id, status) {
  return request({
    url: 'admin/admin/changeGoodsStatus',
    method: 'post',
    params: { id: id, status: status }
  })
}

export function changeGoodsFee(id, status) {
  return request({
    url: 'admin/admin/changeGoodsFee',
    method: 'post',
    params: { id: id, status: status }
  })
}

export function createGoods(query) {
  return request({
    url: 'admin/admin/createGoods',
    method: 'post',
    params: query
  })
}

export function delGoods(id) {
  return request({
    url: 'admin/admin/delGoods',
    method: 'post',
    params: { id: id }
  })
}

export function fetchOneGoods(id) {
  return request({
    url: 'admin/admin/fetchOneGoods',
    method: 'get',
    params: { id: id }
  })
}

export function updateGoods(data) {
  return request({
    url: 'admin/admin/updateGoods',
    method: 'post',
    params: data
  })
}
