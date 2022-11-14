import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default {
  async index(req, res) {
    try {
      const suspects = await prisma.suspect.findMany({
        where: {
          isActivated: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          criminalMotivation: true,
          picture: true,
          reason: true,
          levelWanted: true,
          description: true,
          status: true,
        },
      })

      return res.render("criminals/index", suspects)
    } catch (error) {
      res.render("error")
    }
  },
}
