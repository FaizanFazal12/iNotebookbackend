const jwt = require("jsonwebtoken");
const jwt_secret = "FaizanFazalisagood"

 const fetchuser = (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
         res.status(401).send({ errors: "please provide a valid token" })
    }
    try {
        const data = jwt.verify(token, jwt_secret);
        req.user = data.user;
        next();
    }
    catch (error) {
        return res.status(401).send({ errors: "please provide a valid token" })
    }
}
module.exports=fetchuser

