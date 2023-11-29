var conexion = require("./conexion").conexion;
var conexionNegocio = require("./conexion").conexionNegocio;
var fs = require('fs').promises;
const { generarPassword, validarPassword } = require("../middlewares/password");
var Usuario=require("../modelos/Usuario");

async function mostrarUsuarios() {
    var users=[];
    try{
        var usuarios=await conexion.get();
        usuarios.forEach((usuario)=>{
             var user= new Usuario(usuario.id,usuario.data());
             if(user.bandera==0){
                 users.push(user.obtenerDatos);
             }
        });
    }catch(err){
        console.log("Error al obtener los usuarios de firebase "+err);
        users.push(null);
    }
    return users;
}

async function buscarUsuarioID(id){
    var user;
    try{
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuario.id, usuario.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerDatos;
        }
    }catch(err){
        console.log("Error al buscar al usuario"+err);
        user = null;
    }
    return user;
}

async function usuarioExiste(nombreUsuario) {
    try {
        const snapshot = await conexion.where('usuario', '==', nombreUsuario).get();
        return !snapshot.empty; // Retorna verdadero si hay un usuario con ese nombre
    } catch (error) {
        console.log("Error al verificar si el usuario existe:", error);
        return false; // Por defecto, en caso de error, retorna falso
    }
}

async function nuevoUsuario(datos){
     var{salt,hash}=generarPassword(datos.password);
     datos.password=hash;
     datos.salt=salt;
    datos.admin=false;

    const existeUsuario = await usuarioExiste(datos.usuario);

    if (existeUsuario) {
        console.log("El usaurio ya existe en la base de datos");
        return {
            error: 1
        };
    }

    var usuario=new Usuario(null,datos);
    var error=1;
    if(usuario.bandera==0){
        try{
            await conexion.doc().set(usuario.obtenerDatos);
            console.log("Usuario registrado Correctamente");
            error=0;
        }catch(err){
            console.log("Error al registrar el usuario"+err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
     var user=await buscarUsuarioID(datos.id);
     var error=1;
     if(user!=undefined){
        if(datos.password==""){
            datos.password=user.password;
            datos.salt=user.salt;
        }else{
            var{salt,hash}=generarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        if (datos.foto !== undefined && datos.foto !== user.foto) {
            var fotoRuta = './web/Usuarios/images/' + user.foto;
            await fs.unlink(fotoRuta);
        }
        var user= new Usuario(datos.id,datos)
        if(user.bandera==0){
            try{
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Usuario actualizado");
                error=0;
            }catch(err){
                console.log("Error al modificar usuario"+err);
            }
        }
     }
    return error;
}

async function borrarUsuario(id) {
    var error = 1;
    var user = await buscarUsuarioID(id);
    if (user != undefined) {
        var fotoRuta = './web/Usuarios/images/' + user.foto;
        await fs.unlink(fotoRuta); 
        try {
            var negocios = await conexionNegocio.where('userid', '==', id).get();
            negocios.forEach(async (negocio) => {
            await conexionNegocio.doc(negocio.id).delete();
            });
            await conexion.doc(id).delete();
            console.log("Usuario y sus negocios eliminados correctamente");
            error = 0;
        } catch (err) {
            console.log("Error al borrar usuario y negocios asociados: " + err);
        }
    }
    return error;
}

async function login(datos){
    var user = undefined;
    var usuarioObjeto;
    try{
        var usuarios = await conexion.where('usuario','=',datos.usuario).get();
        if(usuarios.docs.length==0){
            return undefined;
        } 
        usuarios.docs.filter((doc)=>{
            var validar = validarPassword(datos.password,doc.data().password,doc.data().salt);
            if(validar){
                usuarioObjeto = new Usuario(doc.id,doc.data());
                if(usuarioObjeto.bandera==0){ 
                    user=usuarioObjeto.obtenerDatos;
                }
            }
            else 
                return undefined;
        });
    }
    catch(err){
        console.log("Error al recuperar al usuario: "+ err);
    }
    return user;
}

async function mostrarUsuariosCal(idsUsuarios) {
    const users = [];
    try {
        for (const id of idsUsuarios) {
            const usuario = await buscarUsuarioID(id);
            if (usuario) {
                users.push(usuario);
            }
        }
    } catch (err) {
        console.log("Error al obtener los usuarios: " + err);
    }
    return users;
}

module.exports={
    mostrarUsuarios,
    modificarUsuario,
    borrarUsuario,
    buscarUsuarioID,
    nuevoUsuario,
    login,
    mostrarUsuariosCal
}