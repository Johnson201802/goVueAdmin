import request from '@/utils/request'

export function fetchWechatConfig() {
  return request({
    url: 'admin/admin/fetchWechatConfig',
    method: 'get'
  })
}

export function saveConfig(query) {
  return request({
    url: 'admin/admin/saveConfig',
    method: 'post',
    params: query
  })
}

export function getEventAnswer() {
  return request({
    url: 'admin/admin/getEventAnswer',
    method: 'get'
  })
}

export function saveEventAnswer(query) {
  return request({
    url: 'admin/admin/saveEventAnswer',
    method: 'post',
    params: query
  })
}

export function fetchKeywordsList(query) {
  return request({
    url: 'admin/admin/fetchKeywordsList',
    method: 'get',
    params: query
  })
}

export function createKeywords(query) {
  return request({
    url: 'admin/admin/createKeywords',
    method: 'post',
    params: query
  })
}

export function updateKeywords(query) {
  return request({
    url: 'admin/admin/updateKeywords',
    method: 'post',
    params: query
  })
}

export function delKeywords(id) {
  return request({
    url: 'admin/admin/delKeywords',
    method: 'post',
    params: { id: id }
  })
}
