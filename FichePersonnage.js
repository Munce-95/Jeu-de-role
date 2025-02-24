// 📌 URL du script Google Apps Script (remplace par ton vrai URL)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyMzw1WTYmc2kXVZtGqVpA-DICoCTLR-mWYLEgqsHW9vMh93EElZ4kB3gT8uUmO_vS4ag/exec"; // Remplace par ton vrai script ID

// 📌 Charger tous les personnages depuis Google Sheets
async function chargerPersonnages() {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        console.log("📜 Personnages chargés :", personnages);

        // Remplir une liste déroulante avec les personnages chargés
        let select = document.getElementById("playerSelect");
        if (select) {
            select.innerHTML = "";
            personnages.forEach(perso => {
                let option = document.createElement("option");
                option.value = perso.ID;
                option.textContent = perso.Nom;
                select.appendChild(option);
            });
        }

    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

// 📌 Sauvegarder une nouvelle fiche de personnage dans Google Sheets
async function sauvegarderPersonnage() {
    let personnage = {
        ID: Math.floor(Math.random() * 1000000), // Générer un ID unique
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

    // Vérifier que le nom du personnage est rempli
    if (!personnage.Nom) {
        alert("Veuillez entrer un nom !");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personnage)
        });

        const result = await response.json();
        console.log("✅ Personnage sauvegardé :", result);
        alert("Personnage enregistré avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

// 📌 Charger les infos d'un personnage sélectionné
async function chargerFichePersonnage() {
    let playerId = document.getElementById("playerSelect").value;
    if (!playerId) {
        alert("Sélectionnez un personnage !");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        let personnage = personnages.find(perso => perso.ID == playerId);
        if (!personnage) {
            alert("Personnage introuvable !");
            return;
        }

        // Remplir les champs avec les données du personnage sélectionné
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

// 📌 Charger automatiquement les personnages au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    chargerPersonnages();
});
