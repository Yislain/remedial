var ruta=require("express").Router();
var{autorizado,admin}=require("../middlewares/password");
var {subirArchivoN}=require("../middlewares/middlewares");
const conexionN = require("../bd/conexion");
var { mostrarNegocio, buscarNegocioID, nuevoNegocio, modificarNegocio, borrarNegocio, mostrarNegociosUsuario, incrementarCalificacion, mostrarUsuariosCalificados, mostrarNegocioOrdenadoPorCalificacion, validarCamposNoVacios}=require("../bd/negocioBD");
var{buscarUsuarioID}=require("../bd/usuarioBD");


ruta.get("/api/mostrarNegocios",async(req,res)=>{
    var negocios=await mostrarNegocio();
    if(negocios.length==0){
       res.status(400).json("No hay negocios");
    }else{
       res.status(200).json(negocios);
    }
 });
 
 ruta.get("/api/mostrarNegociosUsuario/:id",async(req,res)=>{
   var negocios=await mostrarNegociosUsuario(req.params.id);
   if(negocios.length==0){
      res.status(400).json("No hay negocios");
   }else{
      res.status(200).json(negocios);
   }
});

ruta.get("/api/mostrarUsuariosCalificados/:id",async(req,res)=>{
   var negocios=await mostrarUsuariosCalificados(req.params.id);
   if(negocios.length==0){
      res.status(400).json("No hay negocios");
   }else{
      res.status(200).json(negocios);
   }
});
 
 ruta.post("/api/nuevoNegocio/:id", subirArchivoN(), async(req,res)=>{
      req.body.foto=req.file.filename;
    var error=await nuevoNegocio(req.body,req.params.id);
    if(error==0){
       res.status(200).json("Negocio registrado correctamente");
    }else{
       res.status(400).json("Erro al registrar el Negocio");
    }
 });
 
 ruta.get("/api/buscarNegocioporId/:id",async(req,res)=>{
    var negocio=await buscarNegocioID(req.params.id);
    if(negocio==""){
       res.status(400).json("Negocio no encontrado");
    }else{
       res.status(200).json(negocio);
    }
 });
 
 ruta.post("/api/editarNegocio",subirArchivoN(),async(req,res)=>{
      req.body.foto=req.file.filename;
    var error=await modificarNegocio(req.body);
    if(error==0){
       res.status(200).json("Negocio actualizado correctamente");
    }else{
       res.status(400).json("Error al actualizar el Negocio");
    }
 });
 
 ruta.get("/api/borrarNegocio/:id",async(req,res)=>{
    var error=await borrarNegocio(req.params.id);
    if(error==0){
       res.status(200).json("Negocio borrado");
    }else{
       res.status(400).json("Error al borrar el Negocio")
    }
 });
 module.exports=ruta;