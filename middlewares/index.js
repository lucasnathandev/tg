export default {
  isAuthenticated(req, res, next) {
    if (req.session.login) {
      return next()
    }

    return res.status(403).send(
      `<h3>Para acessar essa página você precisa estar logado!</h3>
        <h4>Redirecionando em 3 segundos...</h4>
        <script>setTimeout(()=> {window.location.assign('/')}, 3000)</script>`
    )
  },
  isAdmin(req, res, next) {
    if (req.session.login.type == "Admin") {
      return next()
    }
    return res
      .status(403)
      .send("Você não tem autorização para acessar essa página!")
  },
}
