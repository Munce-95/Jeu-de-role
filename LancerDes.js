// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;
const API_JETS = `${SUPABASE_URL}/rest/v1/JetDeDes`;

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

        let select = document.getElementById("playerSelect");
        select.innerHTML = ""; // 🔹 Vide la liste avant de la remplir

        data.forEach(personnage => {
            let option = document.createElement("option");
            option.value = personnage.ID; // 🔹 L'ID permet de bien identifier le joueur
            option.textContent = personnage.Nom; // 🔹 Affichage du nom du personnage
            select.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

// 🔹 Charger la liste des personnages au démarrage
document.addEventListener("DOMContentLoaded", chargerPersonnages);

// 🔹 Fonction pour lancer un dé et comparer avec la stat du personnage
async function lancerDe(caracteristique) {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value; // 🔹 Récupère l'ID du personnage sélectionné
    let joueurNom = select.options[select.selectedIndex].text; // 🔹 Récupère son nom

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    // 🔹 Récupérer les stats du joueur depuis Supabase
    try {
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}&select=${caracteristique}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        if (data.length === 0) {
            console.error("❌ Aucun personnage trouvé avec cet ID !");
            return;
        }

        let statJoueur = data[0][caracteristique]; // 🔹 Valeur de la caractéristique sélectionnée
        let resultat = Math.floor(Math.random() * 100) + 1; // 🔹 Simulation d'un d100

        let reussite;
        let cssClass;

        // 🔹 Détermination du résultat avec critiques
        if (resultat === 1) {
            reussite = "Super Réussite Critique";
            cssClass = "SupReuCrit";
        } else if (resultat <= 10) {
            reussite = "Réussite Critique";
            cssClass = "ReuCrit";
        } else if (resultat <= statJoueur) {
            reussite = "Réussite";
            cssClass = "valide";
        } else if (resultat >= 100) {
            reussite = "Super Échec Critique";
            cssClass = "SupEchecCrit";
        } else if (resultat >= 90) {
            reussite = "Échec Critique";
            cssClass = "EchecCrit";
        } else {
            reussite = "Échec";
            cssClass = "invalide";
        }

        console.log(`🎲 ${joueurNom} (${caracteristique} : ${statJoueur}) a obtenu ${resultat} → ${reussite}`);

        // 🔹 Affichage dans l’interface
        let resultatContainer = document.getElementById("resultat");
        resultatContainer.innerHTML = `
            <h3>Résultat du dé pour "<strong>${caracteristique}</strong>" :</h3>
            <h2 class="${cssClass}">${resultat} - ${reussite}</h2>
            <p><small>(${joueurNom})</small></p>
        `;

        // 🔹 Envoi du jet de dé à Supabase
        await fetch(API_JETS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify({
                Joueur: joueurNom,
                Caractéristique: caracteristique,
                Résultat: resultat,
                Issue: reussite
            })
        });

        console.log("✅ Jet enregistré avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement du jet :", error);
    }
}

// 🔹 Charger le dernier résultat au démarrage
async function chargerDernierJet() {
    try {
        let response = await fetch(`${API_JETS}?order=Timestamp.desc&limit=1`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        if (data.length > 0) {
            afficherResultat(data[0]);
        }
    } catch (error) {
        console.error("❌ Erreur lors du chargement du dernier jet :", error);
    }
}

// 🔹 Fonction pour afficher le dernier résultat reçu
function afficherResultat(jet) {
    let cssClass;

    // 🔹 Application des mêmes règles que pour `lancerDe()`
    if (jet.Résultat === 1) {
        cssClass = "SupReuCrit";
    } else if (jet.Résultat <= 10) {
        cssClass = "ReuCrit";
    } else if (jet.Résultat <= jet.Caractéristique) {
        cssClass = "valide";
    } else if (jet.Résultat === 100) {
        cssClass = "SupEchecCrit";
    } else if (jet.Résultat >= 90) {
        cssClass = "EchecCrit";
    } else {
        cssClass = "invalide";
    }

    let resultatContainer = document.getElementById("resultat");
    resultatContainer.innerHTML = `
        <h3>Résultat du dé pour "<strong>${jet.Caractéristique}</strong>" :</h3>
        <h2 class="${cssClass}">${jet.Résultat} - ${jet.Issue}</h2>
        <p><small>(${jet.Joueur})</small></p>
    `;
}

// 🔹 Charger le dernier résultat existant au chargement de la page
document.addEventListener("DOMContentLoaded", chargerDernierJet);
