var conexion = require("./conexion").conexionNegocio;
var fs = require('fs').promises;
var Negocio=require("../modelos/Negocio");
var {mostrarUsuariosCal}=require("../bd/usuarioBD");

async function mostrarNegocio() {
    var neg=[];
    try{
        var negocios=await conexion.get();
        negocios.forEach((negocio)=>{
             var negocio1= new Negocio(negocio.id,negocio.data());
             if(negocio1.bandera==0){
                 neg.push(negocio1.obtenerDatos);
             }
        });
    }catch(err){
        console.log("Error al obtener los negocios de firebase "+err);
        neg.push(null);
    }
    return neg;
}

async function mostrarNegociosUsuario(idUsuario) {
    var negociosUsuario = [];
    try {
        var negocios = await conexion.get();
        negocios.forEach((negocio) => {
            var negocioObjeto = new Negocio(negocio.id, negocio.data());
            if (negocioObjeto.bandera == 0 && negocioObjeto.userid === idUsuario) {
                negociosUsuario.push(negocioObjeto.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al obtener los negocios de firebase " + err);
        negociosUsuario.push(null);
    }
    return negociosUsuario;
}

async function buscarNegocioID(id){
    var neg;
    try{
        var negocio=await conexion.doc(id).get();
        var negocioObjeto=new Negocio(negocio.id, negocio.data());
        if(negocioObjeto.bandera==0){
            neg=negocioObjeto.obtenerDatos;
        }
    }catch(err){
        console.log("Error al buscar al producto"+err);
    }
    return neg;
}

async function nuevoNegocio(datos, userid){
    datos.calificacion=0;
    var negocio=new Negocio(null,datos, userid);
    var error=1;
    if(negocio.bandera==0){
        try{
            await conexion.doc().set(negocio.obtenerDatos);
            console.log("Negocio registrado Correctamente");
            error=0;
        }catch(err){
            console.log("Error al registrar el negocio"+err);
        }
    }
    return error;
}

async function modificarNegocio(datos){
    var negocio=await buscarNegocioID(datos.id);
    var error=1;
    if(negocio!=undefined){  
        
        if (datos.foto !== undefined && datos.foto !== negocio.foto) {
            var fotoRuta = './web/Negocios/images/' + negocio.foto;
            await fs.unlink(fotoRuta);
        }
       var negocio= new Negocio(datos.id,datos)
       if(negocio.bandera==0){
           try{
               await conexion.doc(negocio.id).set(negocio.obtenerDatos);
               console.log("Negocio registrado Correctamente");
               error=0;
           }catch(err){
               console.log("Error al modificar negocio"+err);
           }
       }else{
           console.log("Los datos no son correctos");
       }
    }
   return error;
}

async function borrarNegocio(id){
    var error = 1;
    var negocio = await buscarNegocioID(id);
    if (negocio != undefined) {
        var fotoRuta = './web/Negocios/images/' + negocio.foto;
        await fs.unlink(fotoRuta);
        try{
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error = 0;
        }
        catch(err){
            console.log("Error al borrar negocio: "+err);
        }
        return error;     
    }
}

async function incrementarCalificacion(idNegocio, idUsuario) {
    try {
        const negocio = await buscarNegocioID(idNegocio);
        if (negocio) {
            if (!negocio.usuariosCalificacion.includes(idUsuario)) {
                negocio.usuariosCalificacion.push(idUsuario);
                negocio.calificacion += 1;
                await conexion.doc(idNegocio).set(negocio);

                console.log("Calificación incrementada correctamente");
            } else {
                console.log("El usuario ya incrementó la calificación");
            }
        } else {
            console.log("Negocio no encontrado");
        }
    } catch (err) {
        console.log("Error al incrementar la calificación del negocio: " + err);
    }
}

async function mostrarNegocioOrdenadoPorCalificacion() {
    try {
        const snapshot = await conexion.orderBy("calificacion", "desc").get();
        const negocios = [];
        snapshot.forEach((doc) => {
            const negocio = new Negocio(doc.id, doc.data());
            if (negocio.bandera === 0) {
                negocios.push(negocio.obtenerDatos);
            }
        });
        return negocios;
    } catch (err) {
        console.log("Error al obtener los negocios ordenados por calificación: " + err);
        return null;
    }
}

async function mostrarUsuariosCalificados(idNegocio) {
    try {
        const negocio = await buscarNegocioID(idNegocio);
        if (negocio) {
            const idsUsuarios = negocio.usuariosCalificacion || [];
            const usuarios = await mostrarUsuariosCal(idsUsuarios);
            return usuarios;
        } else {
            console.log("Negocio no encontrado");
            return null;
        }
    } catch (err) {
        console.log("Error al obtener los usuarios que han calificado el negocio: " + err);
        return null;
    }
}

function validarCamposNoVacios(data) {
    var campos = Object.values(data);
    console.log(campos);
    return campos.every(campo => campo.trim() !== '');
}


module.exports={
mostrarNegocio,
buscarNegocioID,
nuevoNegocio,
modificarNegocio,
borrarNegocio,
mostrarNegociosUsuario,
incrementarCalificacion,
mostrarUsuariosCalificados,
mostrarNegocioOrdenadoPorCalificacion,
validarCamposNoVacios
};