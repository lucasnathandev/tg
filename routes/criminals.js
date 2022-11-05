import express from "express"
const router = express.Router()

import middlewares from "../middlewares/index.js"
import criminals from "../controllers/criminals.js"

const { isAdmin, isAuthenticated } = middlewares

router.get("/", isAuthenticated, criminals.index)
router.post("/create", isAuthenticated, isAdmin, criminals.create)

export default router
