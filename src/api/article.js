import request from '@/utils/request'

export function fetchArticleList(query) {
  return request({
    url: 'admin/admin/fetchArticleList',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return request({
    url: 'admin/admin/createArticle',
    method: 'post',
    data
  })
}

export function fetchOneArticle(id) {
  return request({
    url: 'admin/admin/fetchOneArticle',
    method: 'get',
    params:{'id':id}
  })
}

export function updateArticle(data) {
  return request({
    url: 'admin/admin/updateArticle',
    method: 'post',
    data
  })
}

export function delArticle(id) {
  return request({
    url: 'admin/admin/delArticle',
    method: 'POST',
    params:{'id':id}
  })
}
