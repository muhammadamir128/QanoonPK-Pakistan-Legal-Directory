import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db, ensureDatabaseReady } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'qanoonpk-secret-key-development-2026',
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
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

        // 1. Fallback Administrator check
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },
}
