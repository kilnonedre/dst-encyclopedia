import { Get, Post, Put, Delete } from '@/util/http'
import resourceTypes from '@/app/api/resources/resourceType.d'
import registerTypes from '@/app/api/users/register/registerType.d'
import loginTypes from '@/app/api/users/login/loginType.d'
import fileTypes from '@/app/api/files/fileType.d'

const splicePath = (path: string) => {
  return '/api' + path
}

/**用户 */

// 创建用户
export const Register = (params: registerTypes.ConfigPostParams) =>
  Post(splicePath('/users/register'), params)

// 登录
export const Login = (params: loginTypes.ConfigPostParams) =>
  Post(splicePath('/users/login'), params)

/**文件 */

// 文件上传
export const UploadFile = (params: fileTypes.ConfigPostParams) =>
  Post(splicePath('/files'), params)

/**数据库 */

// 检查数据库是否创建
export const CheckDatabase = () => Get(splicePath('/databases'))

// 创建数据库
export const CreateDatabase = () => Post(splicePath('/databases'))

/**模组 */

// 获取模组列表
export const GetMod = () => Get(splicePath('/mods'))

/**资源 */

// 获取资源词条
export const GetResource = (params: resourceTypes.ConfigGetParams) =>
  Get(splicePath('/resources'), params)

// 创建资源词条
export const CreateResource = (params: resourceTypes.ConfigPostParams) =>
  Post(splicePath('/resources'), params)

// 更新资源词条
export const UpdateResource = (params: resourceTypes.ConfigPutParams) =>
  Put(splicePath('/resources'), params)

// 删除资源词条
export const DeleteResource = (params: resourceTypes.ConfigDeleteParams) =>
  Delete(splicePath('/resources'), params)
