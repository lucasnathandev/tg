import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default {
  async create(req, res) {
    // try {
    const { name, user, password, militaryId } = req.body

    const salt = await bcrypt.genSalt(10)

    const encrypted = await bcrypt.hash(password, salt)

    const created = await prisma.agent.create({
      data: {
        name,
        user,
        password: encrypted,
        militaryId,
      },
    })
    if (created) {
      return res.status(201).send(created)
    }
    return res.status(403).send(error.message)
    // } catch (error) {
    // }
  },
}
