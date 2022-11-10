import bcrypt from "bcrypt"
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
    create: {
      async user(req, res) {
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

          const passwordGuard =
            password.match(numbers) && password.match(letters)

          if (
            rg.length < 9 ||
            cpf.length < 11 ||
            !passwordGuard ||
            userAlreadyExists
          ) {
            console.error(
              new Error("Dados inconsistentes, verifique os campos.")
            )
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
      async suspect(req, res) {
        try {
          const {
            name,
            cpf,
            criminalMotivation,
            picture,
            reason,
            levelWanted,
            description,
            status,
          } = req.body

          const suspect = await prisma.suspect.findFirst({
            where: {
              cpf,
            },
          })

          if (suspect) {
            return res.render("error", {
              error: {
                message: "Suspeito já existe no sistema.",
              },
            })
          }

          const created = await prisma.suspect.create({
            data: {
              name,
              cpf,
              criminalMotivation,
              picture,
              reason,
              levelWanted,
              description,
              status,
            },
          })

          created &&
            res.render("success", {
              success: "Suspeito cadastrado no sistema com sucesso!",
              goTo: "/admin",
            })
        } catch (error) {
          return res.render("error")
        }
      },
    },
    update: {
      async user(req, res) {
        try {
          const { id } = req.params
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

          const salt = await bcrypt.genSalt(10)
          const encrypted = await bcrypt.hash(password, salt)

          const birth = new Date(birthDate)

          const updated = await prisma.agent.update({
            where: {
              id,
            },
            data: {
              name,
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
              type,
            },
          })

          res.render("success", {
            success: "Agente atualizado com sucesso!",
            goTo: "/admin",
          })
        } catch (error) {
          res.render("error")
        }
      },
      async suspect(req, res) {
        const { id } = req.params
        const {
          name,
          cpf,
          criminalMotivation,
          picture,
          reason,
          levelWanted,
          description,
          status,
        } = req.body
      },
    },
  },
}
