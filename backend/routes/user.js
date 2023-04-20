//appel d'express 
const express = require('express');
// création du router 
const router = express.Router();

//contrôleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// deux routes post (envoi de l'adresse mail et du mot de passe)
router.post('/signup', userCtrl.signup); //fonction signup
router.post('/login', userCtrl.login); //fonction login

//Pour exporter le router
module.exports = router;