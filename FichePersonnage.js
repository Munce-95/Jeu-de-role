const params = new URLSearchParams(window.location.search);
const joueurID = params.get("joueur"); // ID initial : "joueur1", "joueur2", etc.

document.addEventListener("DOMContentLoaded", () => {
    let personnage = JSON.parse(localStorage.getItem(joueurID)) || {};

    document.getElementById("nomPersonnage").value = personnage.nom || "";
    document.getElementById("histoire").value = personnage.histoire || "";
    document.getElementById("description").value = personnage.description || "";
    document.getElementById("force").value = personnage.force || 0;
    document.getElementById("dexterite").value = personnage.dexterite || 0;
    document.getElementById("constitution").value = personnage.constitution || 0;
    document.getElementById("intelligence").value = personnage.intelligence || 0;
    document.getElementById("sagesse").value = personnage.sagesse || 0;
    document.getElementById("charisme").value = personnage.charisme || 0;
});

function sauvegarderPersonnage() {
    let nomPersonnage = document.getElementById("nomPersonnage").value.trim();

    if (!nomPersonnage) {
        alert("Veuillez entrer un nom pour votre personnage !");
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

    localStorage.setItem(joueurID, JSON.stringify(personnage));
    alert("Personnage sauvegardé !");
}
