//Import de mongoose
const mongoose = require('mongoose');

//Rajout du validateur comme  plug-in à notre schéma => permet améliorer les messages d'erreur lors de l'enregistrement de données uniques.
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma des données
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //l'adresse mail de l'utilisateur de type string, obligatoire =required, 
    //unique=true pour qu'un utisateur ne puisse pas s'inscrire avec la même adresse
    password: { type: String, required: true } //le mot de passe sera un hash de type string et obligatoire 
});

//application du validateur au schéma 
userSchema.plugin(uniqueValidator); //uniqueValidator est l'argument de cette méthode

//Export du schéma sous forme de modèle 
module.exports = mongoose.model('User', userSchema);