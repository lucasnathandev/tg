import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default {
  index(req, res) {
    res.render("agent/index")
  },
  admin: {
    index(req, res) {
      res.render("admin/index")
    },
  },
}
