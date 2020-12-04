import request from '@/utils/request'

export function fetchArticleList(page,limit,sort,title) {
  return request({
    url: '/fetchArticleList',
    method: 'get',
    params: {page:page,limit:limit,title:title}
  })
}

export function createArticle(data) {
  return request({
    url: '/createArticle',
    method: 'post',
    data
  })
}

export function fetchOneArticle(id) {
  return request({
    url: '/fetchOneArticle',
    method: 'get',
    params:{'id':id}
  })
}

export function updateArticle(data) {
  return request({
    url: '/updateArticle',
    method: 'post',
    data
  })
}

export function delArticle(id) {
  return request({
    url: '/delArticle',
    method: 'DELETE',
    params:{'id':id}
  })
}
