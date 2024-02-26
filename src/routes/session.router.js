const express =require("express")
const router = express.Router()



const  UserModel = require("../Dao/models/user.models.js");

//// SESSIONLOGIN

//router.post("/sessionLogin", async (req, res) => {
//    const { email, password } = req.body;
//
//    try {
//        const user = await UserModel.findOne({ email: email });
//    
//        user
//            ? user.password === password
//                ? (req.session.login = true,
//
//                    res.status(200).send({ message: "Login correcto" }))
//                : res.status(401).send({ error: "contraseña o users incorrecto" })
//            : res.status(404).send({ error: "users no encontrado" });
//    } catch (error) {
//        res.status(400).send({ error: "Error en el login" });
//    }
//});
//
//                   LOGIN

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await UserModel.findOne({ email: email });
        if (users) {
            if (users.password === password) {
                req.session.login =true
                req.session.user = {
                    email: users.email,
                    age: users.age,
                    first_name: users.first_name,
                    last_name: users.last_name,
                     role: users.email === 'adminCoder@coder.com' ? 'admin' : 'users' // Asignar el rol del usuario
                  
                };

                res.redirect("/products");
            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "users no encontrado" });
        }

    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})

//               LOGOUT


router.get("/logout", async(req,res)=>{
    if(req.session.login){
        req.session.destroy()
    }
    res.redirect("/login");
})

module.exports=router;