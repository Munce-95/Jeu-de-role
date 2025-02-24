const firebaseConfig = {
    apiKey: "AIzaSyDWIOBmP_ekMY39QrlxwONPOwMNCI1JsfA",
    authDomain: "jeu-de-role-c2c3c.firebaseapp.com",
    projectId: "jeu-de-role-c2c3c",
    storageBucket: "jeu-de-role-c2c3c.firebasestorage.app",
    messagingSenderId: "984167900465",
    appId: "1:984167900465:web:2b643222efc877d62afc10",
    measurementId: "G-8MQWWG8P8N"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const joueurID = params.get("joueur");

document.addEventListener("DOMContentLoaded", () => {
    if (!joueurID) return alert("Erreur : Aucun joueur sélectionné !");

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
    });
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

    db.collection("personnages").doc(joueurID).set(personnage).then(() => {
        alert("Personnage sauvegardé !");
    }).catch((error) => {
        console.error("Erreur d'enregistrement :", error);
    });
}
