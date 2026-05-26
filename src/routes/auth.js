const router = require('express').Router();
const passport = require('passport');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // fim do fluxo OAuth: sessão criada com sucesso, devolve o controlo à interface (single page application)
    res.redirect(`${FRONTEND_URL}/`);
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
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout efetuado com sucesso' });
    });
  });
});

router.get('/login-failed', (req, res) => {
  res.status(401).json({ error: 'Login com GitHub falhou' });
});

module.exports = router;
