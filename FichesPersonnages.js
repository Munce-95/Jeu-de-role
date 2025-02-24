const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

async function chargerPersonnages() {
    let liste = document.getElementById("listePersonnages");
    liste.innerHTML = ""; // Réinitialisation

    try {
        const response = await fetch(API_URL, {
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        const personnages = await response.json();

        personnages.forEach(personnage => {
            let bouton = document.createElement("button");
            bouton.innerText = personnage.Nom;
            bouton.onclick = () => location.href = `FichePersonnage.html?id=${personnage.ID}`;
            liste.appendChild(bouton);
            liste.appendChild(document.createElement("br"));
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

document.addEventListener("DOMContentLoaded", chargerPersonnages);
