class Negocio{
    constructor(id,data){
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;   
        this.ubi=data.ubi;   
        this.desc=data.desc;
        this.foto=data.foto;   
        this.userid=data.userid;
    }
    set id(id){
        if(id!=null)
        id.length>0?this._id=id:bandera=1;
    }

    set nombre(nombre){
        nombre.length>0?this._nombre=nombre:this.bandera=1;
    }
    
    set ubi(ubi){
        ubi.length>0?this._ubi=ubi:this.bandera=1;
    }

    set desc(desc){
        desc.length>0?this._desc=desc:this.bandera=1;
    }

    set foto(foto){
        foto.length>0?this._foto=foto:this.bandera=1;
    }

    set userid(userid){
        userid.length>0?this._userid=userid:this.bandera=1;
    }

    get id(){
        return this._id;
    }

    get nombre(){
        return this._nombre;
    }

    get ubi(){
        return this._ubi;
    }

    get desc(){
        return this._desc;
    }

    get foto(){
        return this._foto;
    }
    get userid(){
        return this._userid;
    }
    
    get obtenerDatos(){
        if(this._id==null){
            return {
                nombre:this.nombre,
                ubi:this.ubi,
                desc:this.desc,
                foto:this.foto,
                userid:this.userid
            }
        }else{
            return{
                id:this.id,
                nombre:this.nombre,
                ubi:this.ubi,
                desc:this.desc,
                foto:this.foto ,
                userid:this.userid
            }
        }
    }
}

module.exports=Negocio;