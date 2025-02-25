const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

// 📌 Charger la liste des personnages depuis Supabase
async function chargerPersonnages() {
    let liste = document.getElementById("listePersonnages");
    liste.innerHTML = ""; // Réinitialisation

    try {
        // 🔍 Effectuer la requête GET vers Supabase
        const response = await fetch(API_URL, {
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        // 🔍 Afficher la réponse brute (pour déboguer)
        console.log("🔍 Réponse brute de Supabase :", response);

        // Vérifier si la requête a échoué (erreur 401, 404, etc.)
        if (!response.ok) {
            console.error(`❌ Erreur HTTP ${response.status} :`, response.statusText);
            return;
        }

        // 📦 Convertir la réponse en JSON
        const personnages = await response.json();
        console.log("📦 Données reçues :", personnages);

        // Vérifier si Supabase a retourné une liste (`array`)
        if (!Array.isArray(personnages)) {
            console.error("❌ Supabase ne renvoie pas une liste :", personnages);
            return;
        }

        // 🟢 Affichage des boutons des personnages
        personnages.forEach(personnage => {
            let bouton = document.createElement("button");
            bouton.innerText = personnage.Nom || `Personnage ${personnage.ID}`;
            bouton.onclick = () => location.href = `FichePersonnage.html?id=${personnage.ID}`;
            liste.appendChild(bouton);
            liste.appendChild(document.createElement("br"));
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

// 📌 Charger la liste des personnages au chargement de la page
document.addEventListener("DOMContentLoaded", chargerPersonnages);
