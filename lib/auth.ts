import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    modelName: "session",
    fields: {
      sessionToken: "token",
      token: "token",
      userId: "userId",
      expires: "expires",
      expiresAt: "expiresAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
    modelName: "account",
    fields: {
      type: "type",
      providerId: "providerId",
      accountId: "accountId",
      userId: "userId",
      providerAccountId: "providerAccountId",
      refreshToken: "refresh_token",
      accessToken: "access_token",
      expiresAt: "expires_at",
      tokenType: "token_type",
      scope: "scope",
      idToken: "id_token",
      sessionState: "session_state",
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  advanced: {
    generateId: false, // Use cuid() from Prisma
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  // Map better-auth fields to our schema
  user: {
    additionalFields: {
      businessName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      taxId: {
        type: "string",
        required: false,
      },
      defaultCurrency: {
        type: "string",
        required: false,
      },
      invoicePrefix: {
        type: "string",
        required: false,
      },
      nextInvoiceNum: {
        type: "number",
        required: false,
      },
      logoUrl: {
        type: "string",
        required: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session