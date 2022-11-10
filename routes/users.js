import express from "express"
const router = express.Router()

import middlewares from "../middlewares/index.js"
import user from "../controllers/users.js"

const { admin } = user
const { isAdmin, isAuthenticated } = middlewares

router.get("/", isAuthenticated, user.index)
router.get("/admin", isAuthenticated, isAdmin, admin.index)
router.post("/admin/create/user", admin.create.user)

export default router
