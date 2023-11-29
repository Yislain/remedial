var admin = require("firebase-admin");
var keys = require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db=admin.firestore();
var conexion=db.collection("golocallyUsuarios");
var conexionNegocio=db.collection("golocallyNegocios");



module.exports={
    conexion,
    conexionNegocio};
