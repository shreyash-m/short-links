const jwt = require("jsonwebtoken")
const common = require("../config/commonFunctions")

module.exports =  (req,res,next) =>{
    const public_url = [
        "signup",
        "login",
    ]
    let path = req.path.split("/")
    if(public_url.includes(path.pop())){
        next()
    }else{
        const token = req.headers['authorization']
        if(!token){
            common.send_response(res,0,"Access Denied",null)
        }else{
            try{
                const isValid = jwt.verify(token.split(" ").pop(),process.env.SECRET_KEY)
                req.token = isValid
                next()
            }catch(err) {
                console.log(err.message)
                common.send_response(res,0,"Token Expire",null)
            }
        }
    }
}