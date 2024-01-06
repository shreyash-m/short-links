const bcrypt = require('bcrypt');
const jwt =  require("jsonwebtoken");

const encrypt_password = (password) =>{
    return new Promise((resolve,reject) =>{
        bcrypt.hash(password, 10, function(err, hash_password) {
            if(err){
                reject(err)
            }
            resolve(hash_password)
        })
    });
}

const decrypt_password = (password,hash_password) =>{
    return new Promise((resolve,reject) =>{
        bcrypt.compare(password, hash_password, function(err, result) {
            if(err){
                reject(err)
            }
            resolve(result)
        });
    })
}

const generate_token = (request_data) =>{
    return new Promise((resolve,_) =>{
        resolve(jwt.sign({
            id:request_data.id,
            email:request_data.email,
        },process.env.SECRET_KEY,{expiresIn:"30d"}))
    })
}

const formatDateTime = (datetime) => {
    var dd = datetime.getDate();
    var mm = datetime.getMonth() + 1;
    var yyyy = datetime.getFullYear();
    var hr = datetime.getHours();
    var min = datetime.getMinutes();
    var sec = datetime.getSeconds();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    datetime = yyyy + "-" + mm + "-" + dd + " " + hr + ":" + min + ":" + sec;
    return datetime;
  };


const random_code = (length) =>{
    const string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let code = ""
    for(let i = 0; i < length; i++){
        code += string[Math.floor(Math.random() * 10)]
    }
    return code
}

const send_response = (res,code,message,data) => {
    res.send({
        code,
        message,
        data
    })
}

module.exports = {
    decrypt_password,
    encrypt_password,
    random_code,
    generate_token,
    send_response,
    formatDateTime
}