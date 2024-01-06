const conn = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");
const {
  checkEmail,
  addUser,
  addLink,
  getAllLinksOfUser,
  getLink,
  updateLink,
  totalRows,
  totalActive,
  totalExpire,
} = require("./queries");
const common = require("../config/commonFunctions");

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const result = await conn.query(checkEmail, [email]);
      if (result.rowCount > 0) {
        common.send_response(res, 0, "Email already Exist", null);
      } else {
        const hash_password = await common.encrypt_password(password);
        const add = await conn.query(addUser, [uuidv4(), email, hash_password]);
        if (add.rowCount === 1) {
          common.send_response(res, 1, "Signup successfully", null);
        } else {
          common.send_response(res, 0, "Bad Request", null);
        }
      }
    } else {
      common.send_response(res, 0, "Bad Request", null);
    }
  } catch (err) {
    console.log(err);
    common.send_response(res, 0, "Internal Server Error", null);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const result = await conn.query(checkEmail, [email]);
      if (result.rowCount > 0) {
        const valid = await common.decrypt_password(
          password,
          result.rows[0].password
        );
        if (result.rows[0].email === email && valid) {
          console.log("object");
          const token = await common.generate_token({
            id: result.rows[0].id,
            email: result.rows[0].email,
          });
          common.send_response(res, 1, "Login Successfull", {
            id: result.rows[0].id,
            email: result.rows[0].email,
            token: token,
          });
        } else {
          common.send_response(res, 0, "Invalid Email or Password", null);
        }
      } else {
        common.send_response(res, 0, "User not Exist", null);
      }
    } else {
      common.send_response(res, 0, "Bad Request", null);
    }
  } catch (err) {
    console.log(err);
    common.send_response(res, 0, "Internal Server Error", null);
  }
};

const generate_link = async (req, res) => {
  const valid_till = new Date();
  valid_till.setHours(new Date().getHours() + 48);
  const url = req.file.path;
  const file_name = req.file.path.split("\\").pop();
  const expire = false;
  const user_id = req.token.id;
  const key = common.random_code(8);
  try {
    const result = await conn.query(addLink, [
      uuidv4(),
      url,
      file_name,
      common.formatDateTime(valid_till),
      expire,
      user_id,
      key,
      common.formatDateTime(new Date()),
    ]);
    if (result.rowCount === 1) {
      common.send_response(res, 1, "Link generated successfully", true);
    } else {
      common.send_response(res, 0, "Link not generated", null);
    }
  } catch (err) {
    console.log(err);
    common.send_response(res, 0, "Internal Server Error", null);
  }
};

const get_all_links = async (req, res) => {
  const user_id = req.token.id;
  try {
    const data = await conn.query(getAllLinksOfUser, [user_id]);
    if (data.rowCount === 0) {
      common.send_response(
        res,
        0,
        "Seems like you don't have any link yest.",
        null
      );
    } else {
      const total = await conn.query(totalRows, [user_id]);
      const active = await conn.query(totalActive, [user_id]);
      const expire = await conn.query(totalExpire, [user_id]);

      common.send_response(res, 1, "Link fetch successfully", {
        rows: data.rows,
        total : Number(total.rows[0].total_rows),
        active : Number(active.rows[0].total_active),
        expire: Number(expire.rows[0].total_expire),
      });
    }
  } catch (err) {
    console.log(err);
    common.send_response(res, 0, "Internal Server Error", null);
  }
};

const process_link = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const result = await conn.query(getLink, [id]);
    if (result.rowCount === 1) {
      const today = new Date();
      const valid_till = new Date(result.rows[0].valid_till);
      //   console.log(today);
      //   console.log(valid_till);
      if (today < valid_till) {
        common.send_response(res, 1, "Link is Valid", result.rows[0]);
        // res.sendFile(path.join(__dirname, '..\\uploads', result.rows[0].filename))
      } else {
        const update = await conn.query(updateLink, [id]);
        if (update.rowCount === 1) {
          common.send_response(res, 0, "Link is Expired", null);
        } else {
          common.send_response(res, 0, "Something went wrong", null);
        }
      }
    } else {
      common.send_response(res, 0, "Invalid link", null);
    }
  } catch (err) {
    console.log(err);
    common.send_response(res, 0, "Internal Server Error", null);
  }
};

module.exports = {
  signup,
  login,
  generate_link,
  get_all_links,
  process_link,
};
