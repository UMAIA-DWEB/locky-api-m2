const router = require('express').Router();
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login-failed',
  }),
  (req, res) => {
    res.redirect('/auth/me');
  }
);

router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      hint: 'Vai a /auth/github para fazer login',
    });
  }
  res.json({
    id: req.user.id,
    githubId: req.user.githubId,
    username: req.user.username,
    email: req.user.email,
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.json({ message: 'Logout efetuado com sucesso' });
    });
  });
});

router.get('/login-failed', (req, res) => {
  res.status(401).json({ error: 'Login com GitHub falhou' });
});

module.exports = router;