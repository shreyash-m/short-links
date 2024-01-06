
const checkEmail = "select * from users where email = $1"
const addUser = "insert into users (id,email,password) values ($1,$2,$3)"
const addLink = "insert into links (id,url,filename,valid_till,expire,user_id,key,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8)"   
const getAllLinksOfUser = "select * from links where user_id = $1 order by created_at DESC"
const getLink = "select * from links where key = $1"
const updateLink = "update links set expire = true WHERE key = $1"

const totalRows = "select COUNT(*) as total_rows from links where user_id = $1"

const totalExpire = "select COUNT(*) as total_expire from links where expire = true and user_id = $1"

const totalActive = "select COUNT(*) as total_active from links where expire = false and user_id = $1"

module.exports = {
    checkEmail,
    addUser,
    addLink,
    getAllLinksOfUser,
    getLink,
    updateLink,
    totalRows,
    totalActive,
    totalExpire
}