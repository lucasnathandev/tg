import express from "express"
const router = express.Router()
import controllers from "../controllers/index.js"

const { login } = controllers

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Central de Monitoramento Inteligente",
  })
})

router.get("/login", login)

export default router
