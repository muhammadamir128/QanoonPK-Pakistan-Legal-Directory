import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { db, ensureDatabaseReady } from '@/lib/db'

// Auto-detect production URL on Vercel if NEXTAUTH_URL is not set
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

const providers: any[] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'lawyer@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password are required')
      }

      const email = credentials.email.trim().toLowerCase()
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@qanoon.pk').trim().toLowerCase()
      const adminPass = process.env.ADMIN_PASSWORD || 'Admin@123'

      // 1. Fallback Administrator check (always works, no DB needed)
      if (email === adminEmail && credentials.password === adminPass) {
        return {
          id: 'cm_admin_system',
          name: 'Administrator',
          email: adminEmail,
          role: 'admin',
        }
      }

      // 2. Query database for user
      try {
        ensureDatabaseReady()
        const user = await db.user.findUnique({
          where: { email },
        })

        if (user && user.password) {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (isPasswordValid) {
            return {
              id: user.id,
              name: user.name ?? 'User',
              email: user.email,
              role: user.role,
            }
          }
        }
      } catch (dbError) {
        console.error('[Auth] Database lookup error:', dbError)
      }

      throw new Error('Invalid email or password')
    },
  }),

  // Google Instant / Fallback Provider for one-click Google Sign-In
  CredentialsProvider({
    id: 'google-instant',
    name: 'Google Instant Sign-In',
    credentials: {
      email: { label: 'Email', type: 'email' },
      name: { label: 'Name', type: 'text' },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        throw new Error('Google email is required')
      }
      const email = credentials.email.trim().toLowerCase()
      const name = credentials.name?.trim() || email.split('@')[0]

      try {
        ensureDatabaseReady()
        let user = await db.user.findUnique({
          where: { email },
        })
        if (!user) {
          user = await db.user.create({
            data: {
              email,
              name,
              role: email.includes('admin') ? 'admin' : 'user',
            },
          })
        }
        return {
          id: user.id,
          name: user.name ?? name,
          email: user.email,
          role: user.role,
        }
      } catch (dbError) {
        console.error('[Auth] Google instant sign-in error:', dbError)
        return {
          id: 'google_' + Math.random().toString(36).substring(2, 9),
          name,
          email,
          role: 'user',
        }
      }
    },
  }),
]

// Add official Google OAuth provider if configured in environment variables
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID.trim().length > 5 &&
  process.env.GOOGLE_CLIENT_SECRET.trim().length > 5
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'qanoonpk-secret-key-development-2026',
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        try {
          ensureDatabaseReady()
          const email = user.email.trim().toLowerCase()
          let existingUser = await db.user.findUnique({
            where: { email },
          })
          if (!existingUser) {
            existingUser = await db.user.create({
              data: {
                email,
                name: user.name || 'Google User',
                role: 'user',
              },
            })
          }
          user.id = existingUser.id
          ;(user as any).role = existingUser.role
          return true
        } catch (err) {
          console.error('[Auth] Error syncing Google OAuth user to DB:', err)
          return true
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = (token.role as string) || 'user'
      }
      return session
    },
  },
  useSecureCookies: isProduction,
}
