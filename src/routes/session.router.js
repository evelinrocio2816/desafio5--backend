const express =require("express")
const router = express.Router()
const { isValidPassword } = require("../utils/hashBcrypt.js");

const  UserModel = require("../Dao/models/user.models.js");
const passport = require("passport");


//                   LOGIN

/*router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                req.session.login =true
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                     role: user.email === 'adminCoder@coder.com' ? 'admin' : 'user' // Asignar el rol del usuario
                };
                res.redirect("/products");
            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "usuario no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})
*/
//               LOGOUT


router.get("/logout", async(req,res)=>{
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect("/login");
})
//            VERSION PASSPORT

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/session/faillogin"}),
 async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/products");
})

router.get("/faillogin", async (req, res ) => {
    console.log("Fallo la estrategia")
    res.send({error: "registro Fallido"});
})


///VERSION PARA GITHUB: 

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("./products");
  }
);

module.exports = router;