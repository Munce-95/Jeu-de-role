// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;
const API_HISTORIQUE = `${SUPABASE_URL}/rest/v1/HistoriqueDes`;

// 🔹 Fonction pour récupérer les personnages
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
        select.innerHTML = ""; // Vide la liste

        data.forEach(personnage => {
            let option = document.createElement("option");
            option.value = personnage.ID;
            option.textContent = personnage.Nom;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Erreur chargement personnages :", error);
    }
}
document.addEventListener("DOMContentLoaded", chargerPersonnages);


// 🔹 Données du jet de dé
let jetData = {
    Joueur: joueurNom,
    Caractéristique: caracteristique,
    Résultat: resultat,
    Issue: reussite,
    created_at: new Date().toISOString() // 🔹 Format correct pour timestamp
};

// 🔹 Log des données envoyées
console.log("📤 Données envoyées à Supabase :", JSON.stringify(jetData, null, 2));

// 🔹 Envoi à Supabase
let response = await fetch(API_HISTORIQUE, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Prefer": "return=representation" // 🔹 Permet de voir la réponse exacte de Supabase
    },
    body: JSON.stringify(jetData)
});

// 🔹 Vérification de la réponse
let responseData = await response.json();
console.log("✅ Réponse de Supabase :", responseData);

if (responseData.error) {
    console.error("❌ Erreur lors de l'enregistrement :", responseData.error);
}


// 🔹 Fonction pour lancer un dé
async function lancerDe(caracteristique) {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value;
    let joueurNom = select.options[select.selectedIndex].text;

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    try {
        // 🔹 Récupérer la stat du joueur
        let response = await fetch(`${API_PERSONNAGES}?ID=eq.${joueurID}&select=${caracteristique}`, {
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

        let statJoueur = data[0][caracteristique];
        let resultat = Math.floor(Math.random() * 100) + 1;
        let { reussite, cssClass } = getResultatClass(resultat, statJoueur);

        console.log(`🎲 ${joueurNom} (${caracteristique} : ${statJoueur}) → ${resultat} → ${reussite}`);

        // 🔹 Affichage privé
        document.getElementById("resultat").innerHTML = `
            <h3>Résultat pour "<strong>${caracteristique}</strong>" :</h3>
            <h2 class="${cssClass}">${resultat} - ${reussite}</h2>
        `;

        // 🔹 Envoi dans l’historique partagé
        await fetch(API_HISTORIQUE, {
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

        console.log("✅ Jet ajouté à l’historique !");
        chargerHistorique(); // 🔹 Rafraîchir l'historique
    } catch (error) {
        console.error("❌ Erreur lors du jet :", error);
    }
}

// 🔹 Fonction pour charger l’historique
async function chargerHistorique() {
    try {
        let response = await fetch(`${API_HISTORIQUE}?order=created_at.desc&limit=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();
        afficherHistorique(data);
    } catch (error) {
        console.error("❌ Erreur chargement historique :", error);
    }
}

// 🔹 Fonction pour déterminer le type de réussite/échec
function getResultatClass(resultat, stat) {
    let cssClass = "invalide";
    let reussite = "Échec";

    if (resultat === 1) {
        cssClass = "SupReuCrit";
        reussite = "Super Réussite Critique";
    } else if (resultat > 1 && resultat <= 10) {
        cssClass = "ReuCrit";
        reussite = "Réussite Critique";
    } else if (resultat <= stat) {
        cssClass = "valide";
        reussite = "Réussite";
    } else if (resultat >= 90 && resultat < 100) {
        cssClass = "EchecCrit";
        reussite = "Échec Critique";
    } else if (resultat === 100) {
        cssClass = "SupEchecCrit";
        reussite = "Super Échec Critique";
    }

    return { reussite, cssClass };
}


// 🔹 Fonction pour afficher l’historique
function afficherHistorique(jets) {
    let historiqueContainer = document.getElementById("historique");
    historiqueContainer.innerHTML = ""; // Vide avant remplissage

    jets.forEach(jet => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${jet.Caractéristique}</strong> : <span class="${getResultatClass(jet.Résultat, jet.Caractéristique).cssClass}">${jet.Résultat}</span> (${jet.Joueur})`;
        historiqueContainer.appendChild(li);
    });
}

// 🔹 Rafraîchir l'historique toutes les 5 secondes
setInterval(chargerHistorique, 5000);
document.addEventListener("DOMContentLoaded", chargerHistorique);
