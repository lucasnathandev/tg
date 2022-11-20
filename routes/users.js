import express from "express"
const router = express.Router()

import middlewares from "../middlewares/index.js"
import user from "../controllers/users.js"
import adminRoutes from "./admin.js"

const { suspect } = user
const { isAdmin } = middlewares

router.use("/admin", isAdmin, adminRoutes)

router.get("/", user.index)
router.get("/list/suspect", suspect.index)

export default router
