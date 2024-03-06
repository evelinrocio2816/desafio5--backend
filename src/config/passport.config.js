const passport = require("passport");
const local = require("passport-local");

const UserModel = require("../Dao/models/user.models");
const { createHash, isValidPassword } = require("../utils/hashBcrypt");
//GitHub
const GitHubStrategy = require("passport-github2");
/*   Passport-local */

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);
          //si no existe creo un nuevo usuario

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //ESTRATEGIA PARA EL LOGIN

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //verifico si existe el usuario con ese mail
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          //si existe verifico la contraseña

          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  /* PASSPORT CON GITHUB */

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.40afe1a58e1368fb",
        secretClient: "0480b9963c0a737fa2fcf806a5bfbce7574b96dc",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile:", profile);
        try {
          let user = await UserModel.findOne({ email: profile._Json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 29,
              email: profile._json.email,
              password: ""
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
