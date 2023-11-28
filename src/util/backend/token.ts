import * as jose from 'jose'
import {
  BE_TOKEN_SECRET,
  BE_TOKEN_VALID,
  BE_TOKEN_AUDIENCE,
  BE_TOKEN_ISSUER,
} from '@/config/env'

const secret = jose.base64url.decode(BE_TOKEN_SECRET)

const createToken = async (params: object) => {
  const jwt = await new jose.EncryptJWT({ ...params })
    // 设置 JWT 的 JWE Protected Header，指定加密算法和解密算法 alg: 算法 enc: 加密
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    // 设置 JWT 的签发时间（Issued At），默认为当前时间
    .setIssuedAt()
    // 设置 JWT 的签发者（Issuer）
    .setIssuer(BE_TOKEN_ISSUER)
    // 设置 JWT 的接收者（Audience）
    .setAudience(BE_TOKEN_AUDIENCE)
    // 设置 JWT 的过期时间，此处为2小时后过期
    .setExpirationTime(BE_TOKEN_VALID)
    // 使用密钥对 JWT 进行加密
    .encrypt(secret)
  return jwt
}

const verifyToken = async (authorization: string) => {
  if (!authorization || !authorization.includes('Bearer '))
    throw new Error('Token 不合法')
  const token = authorization.substring('Bearer '.length, authorization.length)
  const { payload } = await jose.jwtDecrypt(token, secret, {
    issuer: BE_TOKEN_ISSUER,
    audience: BE_TOKEN_AUDIENCE,
  })
  return payload
}

export { createToken, verifyToken }
