//Import de bcrypt
const bcrypt = require('bcrypt');
//Import jsonwebtoken
const jwt = require('jsonwebtoken');
//modèle user
const User = require('../models/user');

//Création des deux middlewares

//fonction signup pour l'enregistrement des nouveaux utilisateurs
exports.signup = (req, res, next) => {
    //fonction asynchrone pour hacher le mot de passe
    bcrypt.hash(req.body.password, 10) // Appel de la fonction (10fois) pour hacher le mot de passe
        //on crée le nouvel utilisateur 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //et on enregistre dans la base de donnée en renvoyant une repronse de succès ou d'echec
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//fonction login pour connecter les utilisateurs existants et s'assurer si les informations sont valides (l'utilisateur existe + mdp correct)
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //objet : email: req.body.email pour filtrer
        // Si la requête s'est bien passée : 
        //verification si l'utilisateur a été trouvé
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // si null 
            }
            bcrypt.compare(req.body.password, user.password) //si utilisateur est enregistré, on compare avec la base de donnée
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); //erreur d'authentification le mot de passe n'est pas correct
                    }
                    res.status(200).json({  // si le mot de passe est correct, on retourne un code 200 avec un objet qui va contenir les infos necessaires à l'authentification des requêtes qui seront emises par l'utilisateur
                        userId: user._id,//id
                        token: jwt.sign( //utilisation de la fonction sign de jsonwebtoken pour chiffrer un nouveau token
                            { userId: user._id }, //Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) afin que la création des sauces restent unique à l'utilisateur
                            'RANDOM_TOKEN_SECRET', //clé secrete qui permet de crypter notre token
                            { expiresIn: '24h' }//argument de config : durée de validité du token est de 24 heures. L'utilisateur devra se reconnecter au bout de 24 heures.
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // erreur de traitement => donc erreur 500
        })
        //si requête a échoué: erreur dans la base de donnée
        .catch(error => res.status(500).json({ error })); //erreur serveur
};