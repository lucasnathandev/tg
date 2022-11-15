import createError from "http-errors"
import express from "express"
import session from "express-session"

import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"

import indexRouter from "./routes/index.js"
import usersRouter from "./routes/users.js"
import criminalsRouter from "./routes/criminals.js"
import middlewares from "./middlewares/index.js"

const { isAuthenticated } = middlewares

const app = express()

// view engine setup
app.set("views", "views")
app.set("view engine", "hbs")

app.use(logger("dev"))
app.use(
  cors({
    methods: ["get", "put", "post", "delete"],
    origin: "127.0.0.1",
  })
)
app.use(
  session({
    secret: btoa("cmi2022"),
    cookie: {
      maxAge: 24 * 3600 * 1000,
    },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static("public"))

app.use("/", indexRouter)
app.use("/user", isAuthenticated, usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

export default app
