const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models');

passport.use(new GitHubStrategy(
  {
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [user] = await User.findOrCreate({
        where: { githubId: String(profile.id) },
        defaults: {
          username: profile.username,
          email: profile.emails?.[0]?.value || null,
        },
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
