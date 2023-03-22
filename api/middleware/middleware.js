userModel = require("../users/users-model");

function logger(req, res, next) {
  let timestamp = new Date().toISOString();
  console.log(
    `${timestamp} -- ${req.method} -- ${req.url} 
    }`
  );
  next();
}

async function validateUserId(req, res, next) {
  try {
    let { id } = req.params;
    let isExist = await userModel.getById(id);
    if (!isExist) {
      res.status(404).json({ message: "not found" });
    } else {
      req.user = isExist;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "işlem yapılamadı" });
  }
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ message: "name alanı eksik" });
  } else {
    req.name = req.body.name;
  }

  next();
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ message: "text alanı eksik" });
  } else {
    req.text = text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın
module.exports = { logger, validateUserId, validateUser, validatePost };
