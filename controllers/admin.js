import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default {
  async createUser(req, res) {
    try {
      const {
        name,
        rg,
        cpf,
        birthDate,
        district,
        publicPlace,
        cellNumber,
        number,
        zipCode,
        complement,
        city,
        state,
        militaryRank,
        commander,
        divisionAddress,
        officeDescription,
        password,
        type,
      } = req.body

      const stringDate = new Date()
        .toLocaleString()
        .split(" ")[0]
        .replace(/\//g, "")

      const birth = new Date(birthDate)
      const user = name.split(" ")[0].concat(stringDate).toLowerCase()

      const userAlreadyExists = await prisma.agent.findFirst({
        where: {
          user,
        },
      })

      const numbers = new RegExp(/\d/)
      const letters = new RegExp(/[A-z]/)

      const passwordGuard = password.match(numbers) && password.match(letters)

      if (
        rg.length < 9 ||
        cpf.length < 11 ||
        !passwordGuard ||
        userAlreadyExists
      ) {
        console.error(new Error("Dados inconsistentes, verifique os campos."))
      }

      const salt = await bcrypt.genSalt(10)

      const encrypted = await bcrypt.hash(password, salt)

      const created = await prisma.agent.create({
        data: {
          name,
          user,
          password: encrypted,
          rg,
          cpf,
          cellNumber,
          birthDate: birth,
          publicPlace,
          number: parseInt(number),
          district,
          complement,
          zipCode,
          city,
          state,
          militaryRank,
          commander,
          divisionAddress,
          officeDescription,
          type: type || "User",
        },
      })

      console.log(created)

      return res.status(201).render("success", {
        success: "Agente criado com sucesso!",
        goTo: "/admin",
      })
    } catch (error) {
      res.status(403).send(error.message)
    }
  },
}
