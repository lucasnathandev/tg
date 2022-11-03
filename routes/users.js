import express from "express"
const router = express.Router()

import middlewares from "../middlewares/index.js"
import {} from "../controllers/users.js"

const { isAdmin } = middlewares

/* GET users listing. */

router.get("/", function (req, res, next) {})

export default router
