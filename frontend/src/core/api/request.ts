import { requestClient } from './axios'
import { registerInterceptors } from './interceptor'

registerInterceptors(requestClient)

export default requestClient
export { ApiError } from './interceptor'
