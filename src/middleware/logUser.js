function logUser(req, res, next) {
  const ts = new Date().toISOString().slice(11, 19);
  let user = 'anonymous';

  if (req.user) {
    user = `${req.user.username} (id=${req.user.id})`;
  }

  console.log(`[${ts}] ${req.method.padEnd(6)} ${req.originalUrl}  user=${user}`);
  next();
}

module.exports = logUser;