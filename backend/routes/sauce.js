//appel d'express 
const express = require('express');
//création du router 
const router = express.Router();
//On appelle le contrôleur pour associer les fonctions aux différentes routes
const auth = require('../middleware/auth');
// on importe la logique des routes
const saucesCtrl = require("../controllers/sauces");

//ROUTES

//Export router
module.exports = router;