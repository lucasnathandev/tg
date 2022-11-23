import express from "express"
const router = express.Router()
import controllers from "../controllers/users.js"

const { admin } = controllers

// GET routes
router.get("/list/user", admin.userList)
router.get("/create/user", admin.createUser.index)
router.get("/update/user/:cpf", admin.updateUser.index)
router.get("/create/suspect", admin.createSuspect.index)
router.get("/update/suspect/:cpf", admin.updateSuspect.index)

// POST routes
router.post("/create/user/complete", admin.createUser.create)
router.post("/create/suspect/complete", admin.createSuspect.create)

// PUT routes
router.post("/update/user/:id/complete", admin.updateUser.update)
router.post("/update/suspect/:id/complete", admin.updateSuspect.update)
router.post("/delete/user/:id", admin.deleteUser.delete)
router.post("/delete/suspect/:id", admin.deleteSuspect.delete)

export default router
