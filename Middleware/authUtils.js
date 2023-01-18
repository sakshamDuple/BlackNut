// const passport = require('passport')
// const LocalStrategy = require('passport-local')
// const { Strategy, ExtractJwt } = require('passport-jwt')

// exports.passportMiddlewares = () => {
//     passport.use(
//         new Strategy(
//             {
//                 secretOrKey: AppConfig.jwtSalt,
//                 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             },
//             async (token, done) => {
//                 try {
//                     return done(null, token.user);
//                 } catch (error) {
//                     done(error);
//                 }
//             }
//         )
//     );
// }