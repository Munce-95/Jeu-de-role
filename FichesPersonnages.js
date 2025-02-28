// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;

// 🔹 Fonction pour charger la liste des personnages
async function chargerPersonnages() {
    try {
        let response = await fetch(API_PERSONNAGES, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();
        console.log("📜 Liste des personnages :", data);

        let liste = document.getElementById("listePersonnages");
        liste.innerHTML = ""; // 🔹 Vide la liste avant de la remplir

        data.forEach(personnage => {
            if (personnage.Nom !== "Maitre du jeu") { // 🔹 Filtre pour exclure le MJ
                let bouton = document.createElement("button");
                bouton.classList.add("fiche-btn");
                bouton.textContent = personnage.Nom;
                bouton.onclick = () => location.href = `FichePersonnage.html?id=${personnage.ID}`;
                liste.appendChild(bouton);
            }
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

// 🔹 Charger la liste au démarrage
document.addEventListener("DOMContentLoaded", chargerPersonnages);
