//appel d'express 
const express = require('express');
//création du router avec la methode router d'express
const router = express.Router();
//On appelle le contrôleur pour associer les fonctions aux différentes routes
const auth = require('../middleware/auth');
// on importe multer a partir du fichier middleware pour les images 
const multer = require('../middleware/multer-config');
// on importe la logique des routes
const saucesCtrl = require("../controllers/sauces");


/***********************************************************************
    ROUTES SAUCES
***********************************************************************/
//on enregistre toutes les routes sur le router

// on récupère les requetes get on intégre et on applique les controllers aux routes
router.get("/", auth, saucesCtrl.getAllSauce);
// on récupère post de creation de sauce et on intégre entre le middleware d'authentification (car il doit faire son travail en amont) et la gestion de la route donc controllers
router.post("/", auth, multer, saucesCtrl.createSauce);
// On récupère les requetes get et on applique les controllers aux routes
router.get("/:id", auth, saucesCtrl.getOneSauce);
// on récupère les requetes put (modification/mise à jour) on intégre entre le middleware d'authentification (car il doit faire son travail en amont) et la gestion de la route donc controllers 
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
// on récupère les requetes delete et on applique les controllers aux routes
router.delete("/:id", auth, saucesCtrl.deleteSauce);
// on récupère requete post de like et on applique les controllers aux routes
router.post("/:id/like", auth, saucesCtrl.likeSauce);

//Export du router
module.exports = router;