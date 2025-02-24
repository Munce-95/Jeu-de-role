const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const API_URL = `${SUPABASE_URL}/rest/v1/personnages`;

// 📌 Charger la liste des joueurs dans le select
async function chargerJoueurs() {
    let select = document.getElementById("playerSelect");

    try {
        const response = await fetch(API_URL, {
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        const personnages = await response.json();
        select.innerHTML = "";

        personnages.forEach(personnage => {
            let option = document.createElement("option");
            option.value = personnage.ID;
            option.text = personnage.Nom;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement des joueurs :", error);
    }
}

// 📌 Fonction pour générer un jet de dés (méthode sécurisée)
function lancementDe() {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomNumber = randomArray[0] % 1000000;
    const thousands = Math.floor(randomNumber / 1000) % 10;
    const tens = Math.floor((randomNumber % 100) / 10);
    return (thousands === 0 && tens === 0) ? 100 : (thousands * 10 + tens);
}

// 📌 Lancer un dé et comparer avec la caractéristique du joueur
async function lancerDe(caracteristique) {
    let joueurID = document.getElementById("playerSelect").value;

    if (!joueurID) {
        document.getElementById("resultat").innerText = "⚠️ Sélectionnez un joueur.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}?ID=eq.${joueurID}`, {
            headers: { 
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        const personnages = await response.json();
        if (personnages.length === 0) {
            document.getElementById("resultat").innerText = "❌ Joueur introuvable.";
            return;
        }

        let personnage = personnages[0];
        let stat = personnage[caracteristique];
        let jet = lancementDe();

        let resultatText = `🎲 Jet de ${caracteristique}: ${jet}`;
        if (jet <= stat) {
            resultatText += " ✅ Réussite !";
        } else {
            resultatText += " ❌ Échec.";
        }

        document.getElementById("resultat").innerText = resultatText;

    } catch (error) {
        console.error("❌ Erreur lors du lancer de dé :", error);
    }
}

// 📌 Charger les joueurs au chargement de la page
document.addEventListener("DOMContentLoaded", chargerJoueurs);
