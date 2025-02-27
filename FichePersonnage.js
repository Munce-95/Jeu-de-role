const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

// 📌 Récupérer l'ID du personnage depuis l'URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
const playerID = getQueryParam("id"); // 🔹 ID récupéré depuis l'URL

// 📌 Charger les infos du personnage
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
        console.log("📦 Données reçues :", personnages);

        if (personnages.length === 0) {
            alert("Personnage introuvable !");
            return;
        }

        let personnage = personnages[0];

        document.getElementById("nomPersonnage").value = personnage.Nom || "";
        document.getElementById("histoire").value = personnage.Histoire || "";
        document.getElementById("description").value = personnage.Description || "";
        document.getElementById("force").value = personnage.Force || 0;
        document.getElementById("dexterite").value = personnage.Dextérité || 0;
        document.getElementById("constitution").value = personnage.Constitution || 0;
        document.getElementById("intelligence").value = personnage.Intelligence || 0;
        document.getElementById("sagesse").value = personnage.Sagesse || 0;
        document.getElementById("charisme").value = personnage.Charisme || 0;

    } catch (error) {
        console.error("❌ Erreur lors du chargement de la fiche :", error);
    }
}

async function sauvegarderPersonnage() {
    let personnage = {
        "Nom": document.getElementById("nomPersonnage").value.trim(),
        "Histoire": document.getElementById("histoire").value.trim(),
        "Description": document.getElementById("description").value.trim(),
        "Force": Number(document.getElementById("force").value),
        "Dextérité": Number(document.getElementById("dexterite").value),
        "Constitution": Number(document.getElementById("constitution").value),
        "Intelligence": Number(document.getElementById("intelligence").value),
        "Sagesse": Number(document.getElementById("sagesse").value),
        "Charisme": Number(document.getElementById("charisme").value)
    };

    console.log("📌 Type de playerID :", typeof playerID, playerID);
    console.log("📌 Données envoyées :", personnage);

    try {
        const response = await fetch(`${API_URL}?ID=eq.${playerID}`, {
            method: "PATCH",  
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personnage)
        });

        console.log("📌 Réponse brute de Supabase :", response);
        console.log("📌 Code HTTP :", response.status);

        // ✅ Si la réponse est vide (204 No Content), on évite `response.json()`
        if (response.status === 204 || response.status === 200) { 
            console.log("✅ Mise à jour réussie, aucune donnée retournée !");
            alert("Personnage mis à jour avec succès !");
            return;
        }

        // 🔹 Vérifie si la réponse contient du JSON valide
        const textResponse = await response.text();
        if (!textResponse) {
            console.log("✅ Mise à jour réussie, mais Supabase n’a rien renvoyé.");
            alert("Personnage mis à jour avec succès !");
            return;
        }

        // 🔹 Convertir en JSON seulement si du contenu est présent
        const result = JSON.parse(textResponse);
        console.log("✅ Personnage mis à jour :", result);
        alert("Personnage mis à jour avec succès !");

        // 📌 Recharger la fiche après la sauvegarde
        chargerFichePersonnage();

    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}


// 📌 Charger la fiche au démarrage
document.addEventListener("DOMContentLoaded", chargerFichePersonnage);
