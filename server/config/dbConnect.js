const { default: mongoose } = require("mongoose");


const dbConnect = () =>{
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log("Conexion correcta con la base de datos")
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    dbConnect
}