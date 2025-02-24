// 📌 Vérifie si Firebase est bien chargé
if (!firebase.apps.length) {
    console.error("❌ Firebase n'est pas chargé !");
} else {
    console.log("✅ Firebase est bien chargé !");
}

// 📌 Récupération du joueur depuis l'URL
const params = new URLSearchParams(window.location.search);
const joueurID = params.get("joueur");

document.addEventListener("DOMContentLoaded", () => {
    if (!joueurID) return alert("Erreur : Aucun joueur sélectionné !");

    // 📌 Charger les données depuis Firebase
    db.collection("personnages").doc(joueurID).get().then((doc) => {
        if (doc.exists) {
            let personnage = doc.data();
            document.getElementById("nomPersonnage").value = personnage.nom || "";
            document.getElementById("histoire").value = personnage.histoire || "";
            document.getElementById("description").value = personnage.description || "";
            document.getElementById("force").value = personnage.force || 0;
            document.getElementById("dexterite").value = personnage.dexterite || 0;
            document.getElementById("constitution").value = personnage.constitution || 0;
            document.getElementById("intelligence").value = personnage.intelligence || 0;
            document.getElementById("sagesse").value = personnage.sagesse || 0;
            document.getElementById("charisme").value = personnage.charisme || 0;
        } else {
            console.log("Aucune donnée trouvée !");
        }
    }).catch(error => console.error("❌ Erreur de chargement :", error));
});

function sauvegarderPersonnage() {
    let nomPersonnage = document.getElementById("nomPersonnage").value.trim();

    if (!nomPersonnage) {
        alert("Veuillez entrer un nom !");
        return;
    }

    let personnage = {
        nom: nomPersonnage,
        histoire: document.getElementById("histoire").value,
        description: document.getElementById("description").value,
        force: Number(document.getElementById("force").value),
        dexterite: Number(document.getElementById("dexterite").value),
        constitution: Number(document.getElementById("constitution").value),
        intelligence: Number(document.getElementById("intelligence").value),
        sagesse: Number(document.getElementById("sagesse").value),
        charisme: Number(document.getElementById("charisme").value)
    };

    console.log("✅ Données envoyées à Firebase :", personnage);

    // 📌 Enregistrer les données sur Firebase
    db.collection("personnages").doc(joueurID).set(personnage).then(() => {
        alert("✅ Personnage sauvegardé !");
    }).catch((error) => {
        console.error("❌ Erreur d'enregistrement :", error);
    });
}
