import request from '@/utils/request'

export function getBaseconfig() {
  return request({
    url: 'getBaseconfig',
    method: 'get'
  })
}

export function saveConfigBase(data) {
  return request({
    url: 'saveConfigBase',
    method: 'post',
    data
  })
}

export function getMsmConfig() {
  return request({
    url: 'getMsmConfig',
    method: 'get'
  })
}

export function saveConfigSms(data) {
  return request({
    url: 'saveConfigSms',
    method: 'post',
    data
  })
}

export function getMchConfig() {
  return request({
    url: 'getMchConfig',
    method: 'get'
  })
}

export function saveConfigMch(data) {
  return request({
    url: 'saveConfigMch',
    method: 'post',
    data
  })
}
