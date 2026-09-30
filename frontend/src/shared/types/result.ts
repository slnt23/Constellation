/** 统一返回包装类 - 前端对应类型 */
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

/** 分页数据返回包装类 */
export interface PageResult<T = any> {
  currentPage: number
  pageSize: number
  total: number
  totalPage: number
  records: T[]
}

export type EmptyResult = Result<null>
export type BooleanResult = Result<boolean>
export type StringResult = Result<string>
export type NumberResult = Result<number>
