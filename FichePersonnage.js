const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

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
        await fetch(API_URL, {
            method: "POST",
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "resolution=merge"
            },
            body: JSON.stringify(personnage)
        });

        alert("Personnage mis à jour !");
        chargerFichePersonnage();

    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

document.addEventListener("DOMContentLoaded", chargerFichePersonnage);
