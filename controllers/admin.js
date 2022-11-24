import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

function formatCpf(cpf) {
  let v = cpf.replace(/\D/g, "")

  v = v.replace(/(\d{3})(\d)/, "$1.$2")

  v = v.replace(/(\d{3})(\d)/, "$1.$2")

  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

  cpf = v
}

function formatRg(rg) {
  let v = rg.replace(/\W/g, "")
  v = v.replace(/(\d{2})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4")
  rg = v
}

function capitalize(text) {
  let prepos = ["da", "do", "das", "dos", "a", "e", "de"]
  return text
    .split(" ") // quebra o texto em palavras
    .map((word) => {
      word = word.toLowerCase()
      if (prepos.includes(word)) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ") // junta as palavras novamente
}

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

      return res.render("agent/List", { users, title: "Lista de Agentes" })
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
        let {
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

        formatCpf(cpf)
        formatRg(rg)
        name = capitalize(name)

        const stringDate = new Date()
          .toLocaleString()
          .split(" ")[0]
          .replace(/\//g, "")

        const formattedCpf = (() => {
          let v = cpf.replace(/\D/g, "")
          v = v.substring(v.length - 5)
          return v
        })()

        const birth = new Date(birthDate)

        const user = name
          .split(" ")[0]
          .concat(formattedCpf, stringDate)
          .toLowerCase()

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
    async index(req, res) {
      try {
        const cpf = atob(req.params.cpf)
        const user = await prisma.agent.findFirst({
          where: {
            cpf,
          },
        })
        user.password = ""
        user.birthDate = `${user.birthDate.getFullYear()}-${
          user.birthDate.getMonth() + 1
        }-${user.birthDate.getDate()}`

        return res.render("admin/createUser", {
          title: "Atualizar Agente",
          updateMode: true,
          user,
          isAdmin: user.type === "Admin",
        })
      } catch (error) {
        return res.render("error")
      }
    },
    async update(req, res) {
      try {
        const { id } = req.params
        let { name } = req.body
        const {
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

        name = capitalize(name)

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
        let {
          name,
          cpf,
          criminalMotivation,
          picture,
          levelWanted,
          description,
          status,
        } = req.body

        formatCpf(cpf)
        name = capitalize(name)

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
    async index(req, res) {
      try {
        const cpf = atob(req.params.cpf)
        const suspect = await prisma.suspect.findFirst({
          where: {
            cpf,
          },
        })

        return res.render("admin/createSuspect", {
          title: "Atualizar Suspeito",
          updateMode: true,
          suspect,
          arrested: suspect.status === "Preso",
        })
      } catch (error) {
        return res.render("error")
      }
    },
    async update(req, res) {
      try {
        console.log(req.body)
        const { id } = req.params
        let { name } = req.body
        const {
          criminalMotivation,
          picture,
          levelWanted,
          description,
          status,
        } = req.body

        name = capitalize(name)

        const updated = await prisma.suspect.update({
          where: {
            id,
          },
          data: {
            name,
            criminalMotivation,
            picture,
            levelWanted: parseInt(levelWanted),
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
        return res.render("error", error)
      }
    },
  },
  deleteUser: {
    index(req, res) {
      res.render("admin/deleteUser", { title: "Inativação de Agente" })
    },
    async delete(req, res) {
      try {
        const { cpf } = req.params

        const deleted = await prisma.agent.update({
          where: {
            cpf: atob(cpf),
          },
          data: {
            isActivated: false,
            deactivatedDate: Date.now(),
          },
        })
        console.log(deleted)
        return res.send({ message: "Agente inativado" })
      } catch (error) {
        res.send(error)
      }
    },
  },
  deleteSuspect: {
    index(req, res) {
      res.render("admin/deleteSuspect", { title: "Inativação de Agente" })
    },
    async delete(req, res) {
      try {
        const { cpf } = req.params
        const deleted = await prisma.suspect.update({
          where: {
            cpf: atob(cpf),
          },
          data: {
            isActivated: false,
            deactivatedDate: Date.now(),
          },
        })
        console.log(deleted)
        return res.send({ message: "Suspeito inativado" })
      } catch (error) {
        return res.render("error", error)
      }
    },
  },
}
