var ruta=require("express").Router();
var {subirArchivoU}=require("../middlewares/middlewares");
const conexion = require("../bd/conexion");

var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarUsuarioID, borrarUsuario}=require("../bd/usuarioBD");

ruta.get("/api/mostrarusuarios",async(req,res)=>{
   var usuarios=await mostrarUsuarios();
   if(usuarios.length==0){
      res.status(400).json("No hay usuarios");
   }else{
      res.status(200).json(usuarios);
   }

});


ruta.post("/api/nuevousuario",subirArchivoU(), async(req,res)=>{
   req.body.foto=req.file.originalname;
   var error=await nuevoUsuario(req.body);
   if(error==0){
      res.status(200).json("Usuario registrado correctamente");
   }else{
      res.status(400).json("Erro al registrar el usuario");
   }
});

ruta.get("/api/buscarUsuarioPorId/:id",async(req,res)=>{
   var user=await buscarUsuarioID(req.params.id);
   if(user==""){
      res.status(400).json("usuario no encontrado");
   }else{
      res.status(200).json(user);
   }
});

ruta.post("/api/editarUsuario",subirArchivoU(),async(req,res)=>{
   req.body.foto=req.file.originalname;
   var error=await modificarUsuario(req.body);
   if(error==0){
      res.status(200).json("Usuario actualizado correctamente");
   }else{
      res.status(400).json("Error al actualizar el Usuario");
   }
});

ruta.get("/api/borrarUsuario/:id",async(req,res)=>{
   var error=await borrarUsuario(req.params.id);
   if(error==0){
      res.status(200).json("Usuario borrado");
   }else{
      res.status(400).json("Error al borrar el Usuario")
   }
});
module.exports=ruta;