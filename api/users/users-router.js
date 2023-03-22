const express = require("express");

const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
const userModel = require("./users-model");
const postModel = require("../posts/posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allUser = await userModel.get();
    res.json(allUser);
  } catch (error) {
    res.status(500).json({ message: "Hata Oluştu" });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
});

router.post("/", validateUser, async (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  try {
    const insertedUser = await userModel.insert({ name: req.name });
    res.status(201).json(insertedUser);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    await userModel.update(req.params.id, { name: req.name });
    const updatedUser = await userModel.getById(req.params.id);
    res.status(201).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    await userModel.remove(req.params.id);
    res.json(req.user);
    next();
  } catch (error) {
    next(error);
  }
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const arrUser = await userModel.getUserPosts(req.params.id);
    res.json(arrUser);
  } catch (error) {
    next(error);
  }
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const newUser = await postModel.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.json(newUser);
    } catch (error) {
      next(error);
    }
    // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
    // user id yi doğrulayan bir ara yazılım gereklidir.+
    // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.+
  }
);

// routerı dışa aktarmayı unutmayın
module.exports = router;
