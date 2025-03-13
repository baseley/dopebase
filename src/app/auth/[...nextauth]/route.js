import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import db from '../db'
import { unescapeString } from '../../../utils'
import jwt from 'jsonwebtoken'

const createProviderUserIfNeeded = async (profile, account) => {
  const { access_token, provider } = account
  const { email, name, login, avatar_url } = profile
  const existingUser = await db.getUserByEmail(email)
  
  if (existingUser) {
    // Update user access token and GitHub metadata
    const metadata = unescapeString(existingUser.metadata)
    let metadataObj = JSON.parse(metadata || "{}")
    metadataObj['githubProfile'] = profile

    await db.updateOne('users', existingUser.id, {
      access_token,
      provider,
      metadata: JSON.stringify(metadataObj),
    })
    console.log('Updated existing user')
    return
  }

  // Create new user
  await db.register(
    email,
    access_token,
    name?.length > 0 ? name : login,
    '',
    '',
    avatar_url,
    'githubUser',
    provider,
    access_token,
    JSON.stringify({ githubProfile: profile })
  )

  console.log('User created')
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
      authorization: {
        params: { scope: 'repo,read:user,user:email' },
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ profile, account }) {
      await createProviderUserIfNeeded(profile, account)
      return true
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async session({ session, token }) {
      return { ...session, jwtToken: token.jwtToken || null }
    },
    async jwt({ token, user, account, profile }) {
      const secretOrKey = process.env.JWT_SECRET || 'fallback_secret'

      if (!token.email) {
        console.error("JWT Error: Token has no email", token)
        return token
      }

      const existingUser = await db.getUserByEmail(token.email)

      if (!existingUser) {
        console.error("JWT Error: No user found for email", token.email)
        return token
      }

      const jwtToken = jwt.sign(
        { id: existingUser.id },
        secretOrKey,
        { expiresIn: "1y" }
      )

      return { ...token, jwtToken: `Bearer ${jwtToken}` }
    }
  }
})
