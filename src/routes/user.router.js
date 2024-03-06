const express =require("express")
const router = express.Router()

const  UserModel = require("../Dao/models/user.models.js");
const passport = require("passport");

//                   POST PARA GENERAR UN USUARIO Y ALMACENARLO EN MONGO-DB


/*router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    try {
        // Verificar si el correo electrónico ya está registrado
        const existUser = await UserModel.findOne({ email: email });
        if (existUser) {
            return res.status(400).send({ error: "El correo electrónico ya está registrado" });
        }
        // Crear un nuevo usuario
        const newUser = await UserModel.create({ first_name, last_name, email, password;createHash(password), age });
        // Almacenar información del usuario en la sesión (puedes ajustarlo según tus necesidades)
        req.session.login = true;
        req.session.user = { ...newUser._doc };
        res.status(200).send({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});*/


//REGISTRO CON PASSPORT

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido"});
})




module.exports= router;