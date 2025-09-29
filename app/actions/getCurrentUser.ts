import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'
import { nextAuthOptions } from '../lib/next-auth/options'

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session?.user?.email) {
      return null
    }

    const response = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!response) {
      return null
    }

    return response

  } catch (error) {
    return null
  }
}

export default getCurrentUser
