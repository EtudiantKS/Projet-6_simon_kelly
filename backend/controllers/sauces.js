/********************************************************************************************
    ici il s'agit de la logique de chaque fonction de Route et on y stock la logique métier
*********************************************************************************************/
//import du Modèle Sauce
const Sauce = require("../models/sauces");
//import du package fs = "file system" de Node qui permet de gerer le téléchargement, de modifier le système de fichiers ou de supprimer les fichiers 
const fs = require('fs');

/***********************************************************************
        GETALLSAUCE
***********************************************************************/
// Permet de récuperer toutes les sauces de la base donnée
exports.getAllSauce = (req, res, next) => {
    // méthode find, aucun objet écrit dans les () car on veut la liste complète 
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error })); // error = raccourci de error :error//
};

/***********************************************************************
        CREATESAUCE
***********************************************************************/
// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // le front-end envoit les données de la requête sous la forme form-data et on les transforme en objet sous la forme JSON 
    const sauceObject = JSON.parse(req.body.sauce);
    // suppression de l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé automatiquement par la base MongoDB
    delete sauceObject._id;
    delete sauceObject._userId; //suppression également du userId de la requête envoyé par le client (il ne faut pas faire confiance au client)
    // Création d'une constante sauce
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId, //Remplacement en base de données par le _userId extrait du token par le middleware d’authentification.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On modifie l'URL de l'image, on veut l'URL complète, on indique comment l'URL doit être 
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Sauvegarde de la sauce dans la base de données avec save 
    sauce.save()
        // On envoi une réponse au frontend avec un statut 201
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        // On ajoute un code erreur en cas de souci 
        .catch(error => res.status(400).json({ error }))
};

/***********************************************************************
        GETONESAUCE
***********************************************************************/

// Permet de récupérer une seule sauce, identifiée par son id depuis la base MongoDB
exports.getOneSauce = (req, res, next) => {
    // méthode findOne, on indique l'objet de comparaison dans les (), l'id de la sauce doit être le même que le paramètre de requête
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce)) // Si ok on retourne une réponse et l'objet
        .catch(error => res.status(404).json({ error })); // Si erreur code 404 car on ne trouve pas l'objet
};

/***********************************************************************
        MODIFYSAUCE
***********************************************************************/
// Permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
    //Création de l'objet sauceObject qui regarde si req.file existe ou non. 
    const sauceObject = req.file ? {
        //si oui => on traite la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        //sinon on traite simplement l'objet entrant dans le corps de la requête
    } : { ...req.body };
    //suppression de l'userId venant de la requête pour éviter que l'utiliseur crée un objet à son nom et le modifie pour le réassignier à un autre utilisateur 
    delete sauceObject._userId; // par mesure de sécurité suppression 
    //recherche et récupération de l'objet dans notre base de donnée afin de verifier si l'utilisateur est bien le créateur de l'objet
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) { //si différent
                res.status(401).json({ message: 'Non autorisé' }); //l'utilisateur ne peut pas modifier une sauce qu'il n'a pas créé
            } else { //si c'est l'utilisateur propriétaire de la sauce 
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

/***********************************************************************
        DELETESAUCE
***********************************************************************/
// Permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    //recherche et récupération de l'objet dans notre base de donnée afin de verifier si l'utilisateur est bien le créateur de l'objet
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //utilisation de l'ID envoyé dans la requête pour accéder à la sauce correspondant à l'id de création dans la base de données
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' }); //l'utilisateur n'est pas autorisé
            } else { //si c'est l'utilisateur propriétaire de la sauce 
                //récupération du nom du fichier grace a un split dans le répertoire image
                const filename = sauce.imageUrl.split('/images/')[1];
                //Utilisation de la fonction unlink de fs pour supprimer le fichier
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

/***********************************************************************
        LIKESAUCE
***********************************************************************/
// Permet de "liker" ou "dislaker" une sauce
exports.likeSauce = (req, res, next) => {
    //Variable pour récupérer : 
    // like présent dans le body
    let like = req.body.like
    // récupération du userID
    let userId = req.body.userId
    // récupération de l'id de la sauce
    let sauceId = req.params.id

    // Si l'utilisateur like
    if (like === 1) {
        //mise à jour dans l'id de la sauce
        Sauce.updateOne({ _id: sauceId },
            {
                // On push l'utilisateur et on incrémente le compteur like de la sauce à 1 dans MongoBD
                $push: { usersLiked: userId },
                $inc: { likes: +1 },
            })
            .then(() => res.status(200).json({ message: 'Mention like ajoutée !' }))
            .catch((error) => res.status(400).json({ error }))
    }

    // Si l'utilisateur dislike
    if (like === -1) {
        //mise à jour dans l'id de la sauce 
        Sauce.updateOne({ _id: sauceId },
            {
                // On push l'utilisateur et on incrémente le compteur dislike de la sauce à 1 dans MongoBD
                $push: { usersDisliked: userId },
                $inc: { dislikes: +1 }, // On incrémente de 1
            })
            .then(() => res.status(200).json({ message: 'Mention dislike ajoutée !' }))
            .catch((error) => res.status(400).json({ error }))
    }

    // Si l'utilisateur annule un like ou un dislike
    if (like === 0) {
        Sauce.findOne({ _id: sauceId }) // Permet de récupérer la sauce identifiée par son id depuis la base MongoDB
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // Si l'id de l'utilisateur est dans le tableau userliked alors il annule un like
                    //mise à jour dans l'id de la sauce
                    Sauce.updateOne({ _id: sauceId },
                        {
                            // On supprime l'utilisateur dans le tableau des likes et on incrémente le compteur like de la sauce à -1 dans MongoBD
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 },
                        })
                        .then(() => res.status(200).json({ message: 'Mention like retirée !' }))
                        .catch((error) => res.status(400).json({ error }))
                }

                if (sauce.usersDisliked.includes(userId)) { // Si l'id de l'utilisateur est dans le tableau userdisliked alors il annule un dislike
                    //mise à jour dans l'id de la sauce
                    Sauce.updateOne({ _id: sauceId },
                        {
                            // On supprime l'utilisateur dans le tableau des dislikes et on incrémente le compteur dislike de la sauce à -1 dans MongoBD
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 },
                        })
                        .then(() => res.status(200).json({ message: 'Mention dislike retirée !' }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(404).json({ error }))
    }
}