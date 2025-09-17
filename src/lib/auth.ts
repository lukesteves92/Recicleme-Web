import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { z } from "zod"
import argon2 from "argon2"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      authorize: async (raw) => {
        const creds = credentialsSchema.safeParse(raw)
        if (!creds.success) return null
        const user = await prisma.user.findUnique({ where: { email: creds.data.email } })
        if (!user) return null
        const ok = await argon2.verify(user.passwordHash, creds.data.password)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name || "" }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub as string
      return session
    }
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
})
