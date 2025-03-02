// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_BESTIAIRE = `${SUPABASE_URL}/rest/v1/bestiaire`;

// 📌 Charger la liste des créatures au démarrage
document.addEventListener("DOMContentLoaded", chargerCreatures);

async function chargerCreatures() {
    try {
        let response = await fetch(API_BESTIAIRE, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        console.log("📜 Données reçues de Supabase :", data);

        let liste = document.getElementById("listeCreatures");
        if (!liste) return; // Vérification d'existence
        liste.innerHTML = "";

        if (!data || data.length === 0) {
            console.warn("⚠️ Aucune créature trouvée !");
            return;
        }

        data.forEach(creature => {
            let bouton = document.createElement("button");
            bouton.innerText = creature.Nom;
            bouton.onclick = () => location.href = `BestiaireDetail.html?id=${creature.id}`;
            liste.appendChild(bouton);
        });
    } catch (error) {
        console.error("❌ Erreur chargement des créatures :", error);
    }
}

// 🔹 Ajouter une créature
async function ajouterCreature() {
    let nom = prompt("Nom de la créature :");
    if (!nom) return;

    let response = await fetch(API_BESTIAIRE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Prefer": "return=representation"
        },
        body: JSON.stringify({
            Nom: nom,
            Description: ""
        })
    });

    let responseData = await response.json();
    console.log("📜 Nouvelle créature ajoutée :", responseData);

    if (response.ok) {
        console.log("✅ Créature ajoutée !");
        location.href = `BestiaireDetail.html?id=${responseData[0].id}`;
    } else {
        console.error("❌ Erreur lors de l'ajout :", responseData);
    }
}

// 🔹 Charger une créature spécifique dans BestiaireDetail.html
async function chargerCreature() {
    let params = new URLSearchParams(window.location.search);
    let creatureID = params.get("id");

    if (!creatureID) {
        alert("Créature introuvable !");
        location.href = "Bestiaire.html";
        return;
    }

    console.log("📜 Chargement de la créature ID :", creatureID);

    try {
        let response = await fetch(`${API_BESTIAIRE}?id=eq.${creatureID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        if (data.length === 0) {
            alert("Créature introuvable !");
            location.href = "Bestiaire.html";
            return;
        }

        console.log("📜 Données de la créature :", data);
        document.getElementById("titreCreature").textContent = `Créature : ${data[0].Nom}`;
        document.getElementById("descriptionCreature").value = data[0].Description;
    } catch (error) {
        console.error("❌ Erreur chargement de la créature :", error);
    }
}

// 🔹 Sauvegarder la créature
async function sauvegarderCreature() {
    let params = new URLSearchParams(window.location.search);
    let creatureID = params.get("id");
    let description = document.getElementById("descriptionCreature").value;

    if (!creatureID) {
        console.error("❌ Impossible de sauvegarder, ID manquant !");
        return;
    }

    try {
        let response = await fetch(`${API_BESTIAIRE}?id=eq.${creatureID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify({ Description: description })
        });

        if (response.ok) {
            console.log("✅ Créature sauvegardée !");
            alert("Description enregistrée !");
        } else {
            console.error("❌ Erreur lors de la sauvegarde :", await response.json());
        }
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

// 📌 Charger une créature si on est sur `BestiaireDetail.html`
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("descriptionCreature")) {
        chargerCreature();
    }
});
