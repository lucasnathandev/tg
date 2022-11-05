import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default {
  index(req, res) {
    res.render("criminals/index")
  },
  async create(req, res) {
    try {
      const { name, age, rg, cpf, level, reason, status } = req.body
      const created = await prisma.suspect.create({
        data: {
          name,
          age,
          rg,
          cpf,
          level,
          reason,
          status,
        },
      })
      if (created) {
        res.render("success", {
          success: "Suspeita cadastrada com sucesso.",
          goTo: "/criminals",
        })
      }
    } catch (error) {
      return res.render("error")
    }
  },
}
