// import de mangoose pour la création du schéma
const mongoose = require("mongoose");

// Le schéma de données contient les champs voulues pour chaque Sauce
// Grâce à la méthode Schema via Mongoose, pour chaque sauce, on indique le type, le critère (obligatoire ou non) grace
// Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

//Export du schéma sous forme de modèle 
module.exports = mongoose.model("Sauce", sauceSchema);