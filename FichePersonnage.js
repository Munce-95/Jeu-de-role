// 🔗 Configurer Supabase avec ton URL et ta clé API
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

// 📌 Fonction pour récupérer les paramètres de l'URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 📌 Récupérer l'ID du joueur depuis l'URL
const playerID = getQueryParam("id");

// 📌 Charger la fiche personnage depuis Supabase
async function chargerFichePersonnage() {
    if (!playerID) {
        alert("Aucun personnage sélectionné !");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?ID=eq.${playerID}`, {
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });
        const personnages = await response.json();

        if (personnages.length === 0) {
            alert("Personnage introuvable !");
            return;
        }

        let personnage = personnages[0]; // On récupère le premier élément trouvé

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

// 📌 Sauvegarder les modifications du personnage dans Supabase
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
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "resolution=merge" // Fusionne les données existantes
            },
            body: JSON.stringify(personnage)
        });

        const result = await response.json();
        console.log("✅ Personnage sauvegardé :", result);
        alert("Personnage mis à jour avec succès !");

        // 📌 Recharger la fiche après la sauvegarde
        chargerFichePersonnage();

    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

// 📌 Charger la fiche personnage au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    chargerFichePersonnage();
});
