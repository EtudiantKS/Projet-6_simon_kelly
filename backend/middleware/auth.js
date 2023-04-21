//Import jsonwebtoken
const jwt = require('jsonwebtoken');

//Export de la fonction qui est notre middleware
module.exports = (req, res, next) => {
    try { //gestion des erreurs
        const token = req.headers.authorization.split(' ')[1]; //recupération du token avec le header,  utilisation donc la fonction split pour tout récupérer après l'espace dans le header
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Utilisation de la fonction verify pour décoder notre token.
        const userId = decodedToken.userId;//Extraction de l'ID utilisateur de notre token 
        req.auth = { //Rajout à l’objet Request afin que nos différentes routes puissent l’exploiter
            userId: userId
        };
        next(); //Si ok et notre utilisateur est authentifié, nous passons à l'exécution à l'aide de la fonction next()
    } catch (error) { //gestion des erreurs
        res.status(401).json({ error }); //envoi de l'erreur 401
    }
};