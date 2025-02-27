// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;

// 🔹 Fonction pour charger les données du personnage
async function chargerFichePersonnage() {
    let urlParams = new URLSearchParams(window.location.search);
    let joueurID = urlParams.get("id");

    if (!joueurID) {
        console.error("❌ Aucun joueur sélectionné !");
        return;
    }

    try {
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();
        if (data.length === 0) {
            console.error("❌ Aucun personnage trouvé !");
            return;
        }

        let personnage = data[0];

        // 🔹 Mise à jour des champs de la fiche
        document.getElementById("nomPersonnage").value = personnage.Nom;
        document.getElementById("histoire").value = personnage.Histoire;
        document.getElementById("description").value = personnage.Description;
        document.getElementById("pv").value = personnage.PV; // 🔹 Mise à jour des PV
        document.getElementById("force").value = personnage.Force;
        document.getElementById("dexterite").value = personnage.Dextérité;
        document.getElementById("constitution").value = personnage.Constitution;
        document.getElementById("intelligence").value = personnage.Intelligence;
        document.getElementById("sagesse").value = personnage.Sagesse;
        document.getElementById("charisme").value = personnage.Charisme;

    } catch (error) {
        console.error("❌ Erreur lors du chargement de la fiche :", error);
    }
}

// 🔹 Fonction pour sauvegarder toutes les données (PV, Stats, Histoire, etc.)
async function sauvegarderPersonnage() {
    let urlParams = new URLSearchParams(window.location.search);
    let joueurID = urlParams.get("id");

    let updatedData = {
        Nom: document.getElementById("nomPersonnage").value,
        Histoire: document.getElementById("histoire").value,
        Description: document.getElementById("description").value,
        pv: document.getElementById("pv").value,
        Force: document.getElementById("force").value,
        Dextérité: document.getElementById("dexterite").value,
        Constitution: document.getElementById("constitution").value,
        Intelligence: document.getElementById("intelligence").value,
        Sagesse: document.getElementById("sagesse").value,
        Charisme: document.getElementById("charisme").value
    };

    try {
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify(updatedData)
        });

        console.log("✅ Personnage mis à jour :", updatedData);
        chargerFichePersonnage(); // 🔹 Recharge les données pour voir les modifications en direct
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du personnage :", error);
    }
}

// 🔹 Fonction pour sauvegarder uniquement les PV en temps réel
async function sauvegarderPV() {
    let urlParams = new URLSearchParams(window.location.search);
    let joueurID = urlParams.get("id");
    let nouveauxPV = document.getElementById("pv").value;

    try {
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify({ PV: nouveauxPV })
        });

        console.log("✅ PV mis à jour :", nouveauxPV);
        chargerFichePersonnage(); // 🔹 Recharge les données pour voir les PV actualisés
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour des PV :", error);
    }
}

// 🔹 Recharger les données du personnage au chargement de la page
document.addEventListener("DOMContentLoaded", chargerFichePersonnage);
