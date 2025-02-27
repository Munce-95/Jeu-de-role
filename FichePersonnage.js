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
        console.log("📥 Données récupérées :", data);

        if (data.length === 0) {
            console.error("❌ Aucun personnage trouvé !");
            return;
        }

        let personnage = data[0];

        // 🔹 Mise à jour des champs HTML
        document.getElementById("nomPersonnage").value = personnage.Nom || "";
        document.getElementById("histoire").value = personnage.Histoire || "";
        document.getElementById("description").value = personnage.Description || "";
        document.getElementById("pv").value = personnage.PV ?? 100; // 🔹 Valeur par défaut si NULL
        document.getElementById("force").value = personnage.Force ?? 10;
        document.getElementById("dexterite").value = personnage.Dextérité ?? 10;
        document.getElementById("constitution").value = personnage.Constitution ?? 10;
        document.getElementById("intelligence").value = personnage.Intelligence ?? 10;
        document.getElementById("sagesse").value = personnage.Sagesse ?? 10;
        document.getElementById("charisme").value = personnage.Charisme ?? 10;

    } catch (error) {
        console.error("❌ Erreur lors du chargement de la fiche :", error);
    }
}

// 🔹 Fonction pour sauvegarder toutes les données du personnage
async function sauvegarderPersonnage() {
    let urlParams = new URLSearchParams(window.location.search);
    let joueurID = urlParams.get("id");

    let updatedData = {
        Nom: document.getElementById("nomPersonnage").value,
        Histoire: document.getElementById("histoire").value,
        Description: document.getElementById("description").value,
        PV: parseInt(document.getElementById("pv").value), // 🔹 Conversion en `INTEGER`
        Force: parseInt(document.getElementById("force").value),
        Dextérité: parseInt(document.getElementById("dexterite").value),
        Constitution: parseInt(document.getElementById("constitution").value),
        Intelligence: parseInt(document.getElementById("intelligence").value),
        Sagesse: parseInt(document.getElementById("sagesse").value),
        Charisme: parseInt(document.getElementById("charisme").value)
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
        chargerFichePersonnage(); // 🔹 Recharge la fiche pour voir la mise à jour
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du personnage :", error);
    }
}

// 🔹 Fonction pour sauvegarder uniquement les PV en temps réel
async function sauvegarderPV() {
    let urlParams = new URLSearchParams(window.location.search);
    let joueurID = urlParams.get("id");
    let nouveauxPV = parseInt(document.getElementById("pv").value); // 🔹 Conversion en `INTEGER`

    if (!joueurID) {
        console.error("❌ Erreur : Aucun ID de joueur !");
        return;
    }

    if (isNaN(nouveauxPV) || nouveauxPV < 0) {
        alert("❌ Veuillez entrer un nombre valide pour les PV !");
        return;
    }

    try {
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Prefer": "return=representation" // 🔹 Permet de voir la réponse de Supabase
            },
            body: JSON.stringify({ PV: nouveauxPV }) // 🔹 Envoi bien formaté
        });

        let responseData = await response.json();
        console.log("✅ PV mis à jour :", responseData);

        if (response.status !== 200) {
            console.error("❌ Erreur lors de la mise à jour des PV :", responseData);
        } else {
            chargerFichePersonnage(); // 🔹 Recharge la fiche pour voir la mise à jour
        }
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour des PV :", error);
    }
}

// 🔹 Charger les données du personnage au démarrage
document.addEventListener("DOMContentLoaded", chargerFichePersonnage);
