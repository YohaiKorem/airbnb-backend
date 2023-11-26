import { User } from '../models/user.model.cjs'
import config from '../config/index.cjs'
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const userService = require('../api/user/user.service.cjs') // Adjust path as needed

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3030/api/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)

        let user = await userService.getById(profile.id)
        if (!user) {
          user = User.fromFacebook(profile)
        }
        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
export default passport
export const initializePassport = () => passport.initialize()
export const sessionPassport = () => passport.session()
