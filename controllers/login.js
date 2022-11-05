import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default async (req, res) => {
  try {
    const { user: username, password } = req.body
    const user = await prisma.agent.findFirst({
      where: {
        user: username,
      },
    })

    if (user) {
      const rightPassword = await bcrypt.compare(password, user.password)

      if (rightPassword) {
        req.session.login = {
          id: user.id,
          role: user.role,
        }
        return req.session.login.role === "Admin"
          ? res.redirect("/user/admin")
          : res.redirect("/user")
      }
      return res.render("error", { error })
    }
  } catch (error) {
    return res.render("error", {
      error,
    })
  }
}
