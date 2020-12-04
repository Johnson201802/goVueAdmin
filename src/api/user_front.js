import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/fetchUserList',
    method: 'get',
    params:{"page":query.page,"limit":query.limit,"sort":query.sort,"title":query.title}
  })
}

export function fetchSearchUserList(query) {
  return request({
    url: '/fetchSearchUserList',
    method: 'get',
    query
  })
}

export function changeRole(user_id, role) {
  return request({
    url: `/changeRole`,
    method: 'post',
    params: { user_id: user_id, role: role }
  })
}

export function delUser(id) {
  return request({
    url: `/delUser`,
    method: 'delete',
    params: {id:id}
  })
}

export function getQuestionList(data) {
  return request({
    url: `/getQuestionList`,
    method: 'GET',
    params: data
  })
}

export function SetRead(id) {
  return request({
    url: `/setRead`,
    method: 'POST',
    params: {id:id}
  })
}
