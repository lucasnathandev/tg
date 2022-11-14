import express from "express"
const router = express.Router()
import controllers from "../controllers/users.js"

const { admin } = controllers

// GET routes
router.get("/list/user", admin.userList)
router.get("/create/user", admin.createUser.index)
router.get("/update/user", admin.updateUser.index)
router.get("/create/suspect", admin.createSuspect.index)
router.get("/update/suspect", admin.updateSuspect.index)

// POST routes
router.post("/create/user/complete", admin.createUser.create)
router.post("/create/suspect/complete", admin.createSuspect.create)

// PUT routes
router.put("/update/user/:id", admin.updateUser.update)
router.put("/update/suspect/:id", admin.updateSuspect.update)
router.put("/delete/user/:id", admin.deleteUser.delete)
router.put("/delete/suspect/:id", admin.deleteSuspect.delete)

export default router
