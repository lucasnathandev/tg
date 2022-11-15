import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

export default {
  async userList(req, res) {
    try {
      const users = await prisma.agent.findMany({
        where: {
          isActivated: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          rg: true,
          cpf: true,
          birthDate: true,
          district: true,
          publicPlace: true,
          cellNumber: true,
          number: true,
          zipCode: true,
          complement: true,
          city: true,
          state: true,
          militaryRank: true,
          commander: true,
          divisionAddress: true,
          officeDescription: true,
          password: false,
          type: false,
          updateDate: false,
          creationDate: false,
          deactivatedDate: false,
          isActivated: false,
          user: false,
        },
      })

      return res.render("agent/List", { ...users, title: "Lista de Agentes" })
    } catch (error) {
      res.render("error")
    }
  },

  createUser: {
    index(req, res) {
      res.render("admin/createUser", { title: "Cadastro de agente" })
    },
    async create(req, res) {
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
            type,
          },
        })

        console.log(created)

        return res.status(201).render("success", {
          success: "Agente criado com sucesso!",
          goTo: "/user",
        })
      } catch (error) {
        res.status(403).send(error.message)
      }
    },
  },

  updateUser: {
    index(req, res) {
      res.render("admin/updateUser", { title: "Atualizar Agente" })
    },
    async update(req, res) {
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
        if (updated) {
          return res.render("success", {
            success: "Agente atualizado com sucesso!",
            goTo: "/user",
          })
        }
        res.render("error", {
          error: {
            message: "Inconsistência nos dados, por favor verifique os campos.",
          },
        })
      } catch (error) {
        res.render("error")
      }
    },
  },
  createSuspect: {
    index(req, res) {
      res.render("admin/createSuspect", { title: "Cadastro de Suspeito" })
    },
    async create(req, res) {
      try {
        const {
          name,
          cpf,
          criminalMotivation,
          picture,
          levelWanted,
          description,
          status,
        } = req.body

        console.log(req.body)

        const suspect = await prisma.suspect.findFirst({
          where: {
            cpf,
          },
        })

        console.log(suspect)

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
            levelWanted: parseInt(levelWanted),
            description,
            status,
          },
        })
        console.log(created)

        created &&
          res.render("success", {
            success: "Suspeito cadastrado no sistema com sucesso!",
            goTo: "/user",
          })
      } catch (error) {
        return res.render("error")
      }
    },
  },
  updateSuspect: {
    index(req, res) {
      res.render("admin/updateSuspect", { title: "Atualizar Suspeito" })
    },
    async update(req, res) {
      try {
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

        const updated = await prisma.suspect.update({
          where: {
            id,
          },
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

        if (updated) {
          return res.render("success", {
            success: "Suspeito atualizado com sucesso!",
            goTo: "/user",
          })
        }
      } catch (error) {
        return res.render("error")
      }
    },
  },
  deleteUser: {
    index(req, res) {
      res.render("admin/deleteUser", { title: "Inativação de Agente" })
    },
    async delete(req, res) {
      try {
        const { id } = req.body
        const deleted = await prisma.agent.update({
          where: {
            id,
          },
          data: {
            isActivated: false,
            deactivatedDate: Date.now(),
          },
        })
      } catch (error) {
        res.render("error")
      }
    },
  },
  deleteSuspect: {
    index(req, res) {
      res.render("admin/deleteSuspect", { title: "Inativação de Agente" })
    },
    async delete(req, res) {
      try {
        const { id } = req.body
        const deleted = await prisma.suspect.update({
          where: {
            id,
          },
          data: {
            isActivated: false,
            deactivatedDate: Date.now(),
          },
        })
      } catch (error) {
        res.render("error")
      }
    },
  },
}
