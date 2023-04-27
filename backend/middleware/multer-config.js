/***********************************************************************
    MULTER : Type de fichier img et gestion de l'emplacement 
***********************************************************************/


//import de multer 
const multer = require('multer');

//dictionnaire des mime types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// objet de config pour multer, utilisation de la méthode diskStorage() qui configure le chemin et le nom de fichier pour les fichiers entrants. 
//on enregistre sur le disque
const storage = multer.diskStorage({
    //1er élement la destination va dire a multer où on va enregistrer les fichier 
    destination: (req, file, callback) => {
        callback(null, 'images');//appel du callback 1er argument null 
    },
    //2ème élement filename va dire a multer le nom du fichier a utiliser 
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');//élimine les espaces avec split et remplacement par des _
        const extension = MIME_TYPES[file.mimetype]; //mine type pour générer l'extention des fichiers
        callback(null, name + Date.now() + '.' + extension); //appel du callback 1er argument null. Permet de créer un nom unique du fichier
    }
});

//export du middleware multer configuré: appel de la méthode multer à laquelle on passe l'objet storage et appel de la methode single = fichier unique 
//permet d'expliquer à multer qu'il s'agit de fichier image uniquement 
module.exports = multer({ storage: storage }).single('image');