const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

async function chargerPersonnages() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Erreur de récupération des personnages");

        const personnages = await response.json();
        console.log("📌 Données reçues :", personnages);

        let liste = document.getElementById("listePersonnages");
        liste.innerHTML = ""; // 🔹 Réinitialisation de la liste

        personnages.forEach(personnage => {
            let bouton = document.createElement("button");
            bouton.className = "fiche-btn";
            bouton.innerText = personnage.Nom ? personnage.Nom : `ID ${personnage.ID}`; // 🔹 Affiche le nom ou l'ID si le nom est vide
            bouton.onclick = () => location.href = `FichePersonnage.html?ID=${personnage.ID}`;
            liste.appendChild(bouton);
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

// 🔹 Charge les personnages quand la page est prête
document.addEventListener("DOMContentLoaded", chargerPersonnages);
