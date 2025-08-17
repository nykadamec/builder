import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Get user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            plan: true,
            aiCallsUsed: true,
            projectsUsed: true,
            exportsUsed: true,
            usageResetDate: true,
          },
        })
        
        if (dbUser) {
          session.user.plan = dbUser.plan
          session.user.usage = {
            aiCallsUsed: dbUser.aiCallsUsed,
            projectsUsed: dbUser.projectsUsed,
            exportsUsed: dbUser.exportsUsed,
            usageResetDate: dbUser.usageResetDate,
          }
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
}

// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    aiCallsPerMonth: 50,
    maxProjects: 3,
    exportsPerMonth: 5,
  },
  PRO: {
    aiCallsPerMonth: 1000,
    maxProjects: 50,
    exportsPerMonth: 100,
  },
  ENTERPRISE: {
    aiCallsPerMonth: -1, // unlimited
    maxProjects: -1, // unlimited
    exportsPerMonth: -1, // unlimited
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS