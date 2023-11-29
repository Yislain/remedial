var ruta=require("express").Router();
var{autorizado,admin}=require("../middlewares/password");
var {subirArchivoN}=require("../middlewares/middlewares");
const conexionN = require("../bd/conexion");
var { mostrarNegocio, buscarNegocioID, nuevoNegocio, modificarNegocio, borrarNegocio, mostrarNegociosUsuario, incrementarCalificacion, mostrarUsuariosCalificados, mostrarNegocioOrdenadoPorCalificacion, validarCamposNoVacios}=require("../bd/negocioBD");
var{buscarUsuarioID}=require("../bd/usuarioBD");

ruta.get("/negocios",async(req,res)=>{
    var negocios=await mostrarNegocio();
    res.render("administrador/negocios/mostrar",{negocios});
 });


 ruta.get("/nuevonegocio",(req,res)=>{
    res.render("administrador/negocios/nuevo");
 });
 
 ruta.post("/nuevonegocio", subirArchivoN(), async(req,res)=>{
   req.body.foto=req.file.originalname;
    var error = await nuevoNegocio(req.body);
    res.redirect("/negocios");
 });
 
 ruta.get("/editarnegocio/:id",async(req,res)=>{
    var negocio = await buscarNegocioID(req.params.id);
    res.render("administrador/negocios/modificar",{negocio});
 });
 
 ruta.post("/editarnegocio", subirArchivoN(), async(req,res)=>{
    if(req.file!=null){
      req.body.foto=req.file.filename;
      }else{
      req.body.foto=req.body.fotoAnterior;
      }
      var error = await modificarNegocio(req.body);
      res.redirect('back');
 });

 ruta.post("/editarnegocioadmin", subirArchivoN(), async(req,res)=>{
   if(req.file!=null){
     req.body.foto=req.file.filename;
     }else{
     req.body.foto=req.body.fotoAnterior;
     }
     var error = await modificarNegocio(req.body);
     res.redirect("/negocios");
});
 
 ruta.get("/borrarnegocio/:idUser/:idNegocio",async(req,res)=>{
   var user = req.params.idUser
    try{
       await borrarNegocio(req.params.idNegocio);
       res.redirect(`/inicio/${user}`);
    }catch(err){
       console.log("Error al borrar el producto"+err);
    }
 });

 ruta.get("/borrarnegocioadmin/:id",async(req,res)=>{
    try{
       await borrarNegocio(req.params.id);
       res.redirect("/negocios");
    }catch(err){
       console.log("Error al borrar el negocio"+err);
    }
 });

 ruta.get("/explorar/:id",autorizado,async(req,res)=>{
   var user = await buscarUsuarioID(req.params.id);
   var negocios = await mostrarNegocioOrdenadoPorCalificacion();
   res.render("sitio/explorar", {user, negocios});
});


ruta.get("/negocio/:idUser/:idNegocio",autorizado,async(req,res)=>{
   var user = await buscarUsuarioID(req.params.idUser);
   var negocios = await buscarNegocioID(req.params.idNegocio);
   console.log(negocios);
   res.render("sitio/negocios", {user, negocios});
});


ruta.get("/nuevosnegocios/:id", async(req,res)=>{
   var user = await buscarUsuarioID(req.params.id);
   res.render("sitio/nuevonegocio",{user});
});

ruta.post("/nuevosnegocios/:id", subirArchivoN(), async(req,res)=>{
   var idUsuario=req.params.id;
   req.body.userid = idUsuario;
   req.body.foto=req.file.filename;
   var error = await nuevoNegocio(req.body,idUsuario);
   res.redirect(`/explorar/${idUsuario}`);
});


ruta.get("/perfilnegocio/:id",autorizado,async(req,res)=>{
   var user = await buscarUsuarioID(req.params.id);
   var negocios = await mostrarNegociosUsuario(req.params.id);
   res.render("sitio/perfilnegocio", {user, negocios});
});

ruta.get("/modificarnegocio/:idUser/:idNegocio",autorizado,async(req,res)=>{
   var user = await buscarUsuarioID(req.params.idUser);
   var negocio = await buscarNegocioID(req.params.idNegocio);
   var usuariosCalificados = await mostrarUsuariosCalificados(req.params.idNegocio);
   res.render("sitio/modificarnegocio", {user, negocio, usuariosCalificados});
});
ruta.post("/modificarnegocio", subirArchivoN(), async(req,res)=>{
   if(req.file!=null){
     req.body.foto=req.file.filename;
     }else{
     req.body.foto=req.body.fotoAnterior;
     }
     var error = await modificarNegocio(req.body);
     res.redirect("/negocios");
});

ruta.post("/negocio/me-gusta/:idUsuario/:idNegocio", async (req, res) => {
   const idNegocio = req.params.idNegocio;
   const idUsuario = req.params.idUsuario; // Suponiendo que el ID del usuario está disponible en req.user.id

   // Llamar a la función para incrementar la calificación del negocio
   await incrementarCalificacion(idNegocio, idUsuario);
   
   res.redirect('back'); 
});


module.exports=ruta;