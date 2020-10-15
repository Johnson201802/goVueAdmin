import request from '@/utils/request'

export function getBaseconfig() {
  return request({
    url: 'admin/admin/getBaseconfig',
    method: 'get'
  })
}

export function saveConfigBase(data) {
  return request({
    url: 'admin/admin/saveConfigBase',
    method: 'post',
    data
  })
}

export function getMsmConfig() {
  return request({
    url: 'admin/admin/getMsmConfig',
    method: 'get'
  })
}

export function saveConfigSms(data) {
  return request({
    url: 'admin/admin/saveConfigSms',
    method: 'post',
    data
  })
}

export function getMchConfig() {
  return request({
    url: 'admin/admin/getMchConfig',
    method: 'get'
  })
}

export function saveConfigMch(data) {
  return request({
    url: 'admin/admin/saveConfigMch',
    method: 'post',
    data
  })
}
