import { User } from '@prisma/client'
import { prisma } from '../../common/prisma/prismaClient'
import { escapeObject } from '../../../../utils'

const Validator = require('validator')

async function getUserByID(userID: string): Promise<User | null> {
  return prisma.user.findFirst({ where: { id: Validator.escape(userID) } })
}

async function getUserByToken(token: string): Promise<User | null> {
  if (!token || token.length === 0) {
    return null
  }

  const auth = await prisma.auth.findFirst({
    where: { resetToken: Validator.escape(token) },
  })

  if (auth?.userId) {
    return prisma.user.findFirst({
      where: { id: auth.userId },
    })
  }

  return null
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: { email: Validator.escape(email) },
  })

  return user
}

async function createNewUser(
  email: string,
  encryptedPassword: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  profilePictureURL?: string,
  role?: string,
  provider: string = '',
  metadata: string = '',
): Promise<User> {
  const dateStr = new Date().toISOString() // ✅ Use ISO format

  const insertData = {
    email,
    firstName,
    lastName,
    phone,
    profilePictureURL,
    role,
    metadata,
    createdAt: dateStr,
    updatedAt: dateStr,
  }

  const user = await prisma.user.create({
    data: escapeObject(insertData),
  })

  await prisma.auth.create({
    data: {
      userId: user.id,
      encryptedPassword,
      providerType: provider ? provider : email ? 'email' : 'phone',
      createdAt: dateStr,
      updatedAt: dateStr,
    },
  })

  return user
}

export { getUserByID, getUserByEmail, createNewUser, getUserByToken }
