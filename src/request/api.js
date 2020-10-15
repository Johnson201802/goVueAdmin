/**
 * api接口统一管理
 */
import { get, post } from './http'

export const apiAddress = p => post('admin/admin/login', p)
