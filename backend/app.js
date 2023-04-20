/***********************************************************************
    Fichier qui contient l'application
***********************************************************************/


/***********************************************************************
    APPLICATION EXPRESS
***********************************************************************/
//Appel de express
const express = require('express');
//Constante app permet de créer une application express
const app = express();

/***********************************************************************
    ROUTES
***********************************************************************/
//import du userRoutes
const userRoutes = require('./routes/user');

/***********************************************************************
    BASE DE DONNEES MONGOOSE
***********************************************************************/
//Constante pour importer mongoose dans notre fichier
const mongoose = require('mongoose');
//Connexion à la base de données
mongoose.connect('mongodb+srv://user_1:user1@cluster0.p08lmx4.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/***********************************************************************
    CORS
***********************************************************************/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON. 
//Utilisation du Middleware, mis à disposition par le framework Express. 
app.use(express.json());


/***********************************************************************
    MIDDLEWARE
***********************************************************************/
//Enregistrement et ulisation de la route userRoutes
app.use('/api/auth', userRoutes); //'/api/auth' = racine de la route lié à l'authentification attendu par l'application front 


module.exports = app;