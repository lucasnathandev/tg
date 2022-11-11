export default (req, res, next) => {
  if (req.session.login) {
    req.session.login = null
    res.redirect("/")
  }
  next()
}
