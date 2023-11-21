import { response, tryRes } from '@/util/backend'
import types from './databaseType'
import tableList from '@/config/mysql/database.json'
import dbQuery from '@/util/mysql'

const getFun = async () => {
  const sql =
    'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "dst_encyclopedia"'
  const data = (await dbQuery(sql, [])) as Array<types.ConfigTable>
  const format = data.map(item => {
    return item.TABLE_NAME
  })
  const isSame = tableList.length === format.length
  return isSame
}

export const GET = async () => {
  const { isSuccess, data, error } = await tryRes(getFun)
  if (isSuccess) {
    const msg = `${data ? '不' : ''}需要对表进行修改`
    return response(200, 200, data, msg)
  }
  return response(200, 400, false, error.sqlMessage)
}

const postFun = async () => {
  await Promise.all(
    tableList.map(table => {
      const declare: Array<string> = []
      for (const key in table.data) {
        const isPrimaryKey = key === table.primaryKey
        declare.push(
          `${key} ${table.data[key as keyof typeof table.data]} ${
            isPrimaryKey ? 'PRIMARY KEY AUTO_INCREMENT' : ''
          }`
        )
      }
      const sql = `CREATE TABLE IF NOT EXISTS ${table.name} (${declare.join(
        ','
      )})`
      return dbQuery(sql, [])
    })
  )
  return true
}

export const POST = async () => {
  const { isSuccess, error } = await tryRes(postFun)
  if (isSuccess) return response(200, 200, true)
  return response(200, 400, false, error.sqlMessage)
}
