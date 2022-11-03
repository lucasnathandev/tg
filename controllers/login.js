import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default async (req, res) => {
  try {
    const user = await prisma.agent.findUnique({
      where: {
        user: req.body.user,
      },
    })
    if (user) {
      const rightPassword = await bcrypt.compare(
        req.body.password,
        user.password
      )

      if (rightPassword) {
        req.session.login = {
          id: user.id,
          militaryId: user.militaryId,
          role: user.role,
        }
        return req.session.login.role === "Admin"
          ? res.redirect("/user/admin")
          : res.redirect("/user")
      }
    }
  } catch (error) {
    return res.render("error")
  }
}
