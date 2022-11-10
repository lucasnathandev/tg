export default (req, res) => {
  req.session.login = null
  console.log(req.session)
  res.redirect("/")
}
