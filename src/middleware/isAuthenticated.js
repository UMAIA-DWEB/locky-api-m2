function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: 'Autenticação necessária',
    hint: 'Faz login em /auth/github',
  });
}

module.exports = isAuthenticated;
