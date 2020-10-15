import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'admin/admin/fetchUserList',
    method: 'get',
    params: query
  })
}

export function fetchSearchUserList(query) {
  return request({
    url: 'admin/admin/fetchSearchUserList',
    method: 'get',
    params: query
  })
}

export function changeRole(user_id, role) {
  return request({
    url: `admin/admin/changeRole`,
    method: 'post',
    params: { user_id: user_id, role: role }
  })
}

export function delUser(id) {
  return request({
    url: `admin/admin/delUser`,
    method: 'delete',
    params: id
  })
}

