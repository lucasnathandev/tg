import express from "express"
const router = express.Router()
import controllers from "../controllers/index.js"

const { login, admin } = controllers

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Central de Monitoramento Inteligente",
  })
})

router.post("/login", login)
router.post("/user/create", admin.create)

export default router
