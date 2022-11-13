import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default {
  async index(req, res) {
    const criminals = await prisma.suspect.findMany({
      select: {
        name: true,
        cpf: true,
        criminalMotivation: true,
        reason: true,
        levelWanted: true,
        status: true,
        description: true,
      },
    })

    res.render("criminals/index", {
      criminals: criminals.length
        ? criminals
        : "Não existem suspeitos cadastrados no sistema.",
    })
  },
}
