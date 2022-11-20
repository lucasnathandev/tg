import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import admin from "./admin.js"
import suspect from "./suspect.js"
const prisma = new PrismaClient()

export default {
  index(req, res) {
    const admin = req.session.login.type === "Admin"
    return res.render("agent/index", { admin })
  },
  suspect,
  admin,
}
