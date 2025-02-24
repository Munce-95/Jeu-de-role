const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyMzw1WTYmc2kXVZtGqVpA-DICoCTLR-mWYLEgqsHW9vMh93EElZ4kB3gT8uUmO_vS4ag/exec";

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const playerID = getQueryParam("id");

async function chargerFichePersonnage() {
    if (!playerID) {
        alert("Aucun personnage sélectionné !");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        let personnage = personnages.find(perso => perso.ID == playerID);
        if (!personnage) {
            alert("Personnage introuvable !");
            return;
        }

        document.getElementById("nomPersonnage").value = personnage.Nom || "";
        document.getElementById("histoire").value = personnage.Histoire || "";
        document.getElementById("description").value = personnage.Description || "";
        document.getElementById("force").value = personnage.Force || 0;
        document.getElementById("dexterite").value = personnage.Dextérité || 0;
        document.getElementById("constitution").value = personnage.Constitution || 0;
        document.getElementById("intelligence").value = personnage.Intelligence || 0;
        document.getElementById("sagesse").value = personnage.Sagesse || 0;
        document.getElementById("charisme").value = personnage.Charisme || 0;

        console.log("✅ Fiche personnage chargée :", personnage);
    } catch (error) {
        console.error("❌ Erreur lors du chargement de la fiche :", error);
    }
}

async function sauvegarderPersonnage() {
    let personnage = {
        ID: playerID,
        Nom: document.getElementById("nomPersonnage").value.trim(),
        Histoire: document.getElementById("histoire").value.trim(),
        Description: document.getElementById("description").value.trim(),
        Force: Number(document.getElementById("force").value),
        Dextérité: Number(document.getElementById("dexterite").value),
        Constitution: Number(document.getElementById("constitution").value),
        Intelligence: Number(document.getElementById("intelligence").value),
        Sagesse: Number(document.getElementById("sagesse").value),
        Charisme: Number(document.getElementById("charisme").value)
    };

    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personnage)
        });

        const result = await response.json();
        console.log("✅ Personnage sauvegardé :", result);
        alert("Personnage mis à jour avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chargerFichePersonnage();
});
