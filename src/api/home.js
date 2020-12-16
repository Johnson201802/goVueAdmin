import request from '@/utils/request'

export function fetchMerchantListHome() {
  return request({
    url: '/getMerchantList55',
    method: 'get'
  })
}
