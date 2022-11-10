import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default async (req, res) => {
  try {
    const { user, password } = req.body
    const foundUser = await prisma.agent.findFirst({
      where: {
        user,
      },
    })

    const rightPassword = await bcrypt.compare(password, foundUser.password)

    if (rightPassword) {
      req.session.login = {
        id: foundUser.id,
        type: foundUser.type,
      }
      return req.session.login.type === "Admin"
        ? res.redirect("/user/admin")
        : res.redirect("/user")
    }
    res.render("error", {
      message: "Credenciais inválidas",
      error: {
        status: 401,
        stack: "Não pode acessar o sistema.",
      },
    })
  } catch (error) {
    return res.render("error", {
      error,
    })
  }
}
