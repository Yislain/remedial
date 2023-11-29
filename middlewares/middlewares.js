var multer=require("multer");

function subirArchivoU(){
    var storage=multer.diskStorage({
        destination: './web/Usuarios/images',
        filename: (req,file,cb)=>{
            var archivo=Date.now()+file.originalname;
            cb(null,archivo);
        }
    });
    return multer({storage}).single('foto');
}

function subirArchivoN(){
    var storage=multer.diskStorage({
        destination: './web/Negocios/images',
        filename: (req,file,cb)=>{
            var archivo=Date.now()+file.originalname;
            cb(null,archivo);
        }
    });
    return multer({storage}).single('foto');
}

module.exports={
    subirArchivoU,
    subirArchivoN,
}
