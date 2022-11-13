import express from "express"
const router = express.Router()

import middlewares from "../middlewares/index.js"
import user from "../controllers/users.js"

const { admin } = user
const { isAdmin, isAuthenticated } = middlewares

router.get("/", isAuthenticated, user.index)
router.use("/admin", isAuthenticated, isAdmin)
router.get("/admin/create/user", admin.createUser.index)
router.post(
  "/admin/create/user/:id",
  // isAuthenticated,
  // isAdmin,
  admin.createUser.create
)
router.get(
  "/admin/create/suspect",
  // isAuthenticated,
  // isAdmin,
  admin.createSuspect.index
)
router.post(
  "/admin/create/suspect/:id",
  // isAuthenticated,
  // isAdmin,
  admin.createSuspect.create
)

export default router
