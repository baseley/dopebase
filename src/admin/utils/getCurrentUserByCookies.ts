import { cookies } from 'next/headers'
import { getUserByID } from '../../core/db/users'

const jwt = require('jsonwebtoken')

export const getCurrentUserByCookies = async () => {
  const cookieStore = await cookies() // Ensure it's awaited
  const tokenObj = cookieStore.get('dopebase.session-token')
  const token = tokenObj?.value
  const secretOrKey = process.env.JWT_SECRET

  if (!token || !secretOrKey) {
    return null
  }

  try {
    const decoded = jwt.verify(token, secretOrKey)
    const userID = decoded.id

    if (!userID) {
      return null
    }

    const user = await getUserByID(userID)

    return user || null
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export const getCurrentUser = async () => {
  return await getCurrentUserByCookies()
}

export const getCurrentAdmin = async () => {
  const user = await getCurrentUserByCookies()
  return user?.role === 'admin' ? user : null
}
