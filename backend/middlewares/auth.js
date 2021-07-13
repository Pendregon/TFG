const jwt = require('jsonwebtoken');

let authentication = (req, res, next) => {
    // Leer headers
    let token = req.headers.authorization;
    jwt.verify(token, 'secret', (err, decoded) => {
        if(err) {
            next('route')
        }else{
            // Creamos una nueva propiedad con la info del usuario
            if(decoded) req.user = decoded.data //data viene al generar el token en login.js
            next()
        }
    });
}
  
module.exports = {authentication};
  