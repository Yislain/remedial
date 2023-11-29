var ruta=require("express").Router();
var {subirArchivoU}=require("../middlewares/middlewares");
var{autorizado}=require("../middlewares/password");
const conexion = require("../bd/conexion");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarUsuarioID, borrarUsuario, login}=require("../bd/usuarioBD");


ruta.get("/", autorizado,async(req,res)=>{
   res.redirect("/login");
});

ruta.get("/inicio/:id", autorizado,async(req,res)=>{
   var user = await buscarUsuarioID(req.params.id);
   if (user) {
       res.render("sitio/inicio", {user});
   } else {
       console.log("Usuario no existe");
   }
});

ruta.get("/admin", autorizado,async(req,res)=>{
   var usuarios=await mostrarUsuarios();
   res.render("administrador/usuarios/mostrar",{usuarios});
});

ruta.get("/nuevousuario",(req,res)=>{
   res.render("administrador/usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivoU(), async(req,res)=>{
   req.body.foto=req.file.filename;
   var error=await nuevoUsuario(req.body);
   res.redirect("/");
});

ruta.post("/nuevousuarioadmin", subirArchivoU(), async(req,res)=>{
   req.body.foto=req.file.filename;
   var error=await nuevoUsuario(req.body);
   res.redirect("/admin");
});




ruta.get("/editarusuario/:id",async(req,res)=>{
   var user=await buscarUsuarioID(req.params.id);   
   res.render("administrador/usuarios/modificar",{user});
});

ruta.post("/editarusuario",subirArchivoU(), async(req,res)=>{
   if(req.file!=null){
   req.body.foto=req.file.filename;
   }else{
   req.body.foto=req.body.fotoAnterior;
   }
   var error=await modificarUsuario(req.body);
   res.redirect("/admin");
});

ruta.get("/borrarusuario/:id",async(req,res)=>{
   try{
      await borrarUsuario(req.params.id);
      res.redirect("/");
   }catch(err){
      console.log("Error al borrar el usuario"+err);
   }
});

ruta.get("/borrarusuarioadmin/:id",async(req,res)=>{
   try{
      await borrarUsuario(req.params.id);
      res.redirect("/admin");
   }catch(err){
      console.log("Error al borrar el usuario"+err);
   }
});

ruta.get("/login",(req,res)=>{
   res.render("administrador/usuarios/login")
});

ruta.post("/login",async(req,res)=>{
   var user=await login(req.body);
   if(user==undefined){
      res.redirect("/login");
   }else{
      if(user.admin){
         console.log("Administrador");
         req.session.admin=req.body.usuario;
         res.redirect("/admin");
      }else{
         console.log("Usuario");
         req.session.usuario=req.body.usuario;
         res.redirect("/inicio/" + user.id);
      }
   }
});

ruta.get("/perfil/:id", async (req, res) => {
   var user = await buscarUsuarioID(req.params.id);
   res.render("sitio/perfil", {user});
});

ruta.post("/perfil",subirArchivoU(), async(req,res)=>{
   if(req.file!=null){
   req.body.foto=req.file.filename;
   }else{
   req.body.foto=req.body.fotoAnterior;
   }
   var error=await modificarUsuario(req.body);
   res.redirect("/");
});

ruta.get("/registro",(req,res)=>{
   res.render("sitio/registro");
});




ruta.get("/logout",(req,res)=>{
   req.session=null;
   res.redirect("/login");
});




module.exports=ruta;