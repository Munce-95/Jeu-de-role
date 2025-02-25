// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_PERSONNAGES = `${SUPABASE_URL}/rest/v1/personnages`;
const API_JETS = `${SUPABASE_URL}/rest/v1/JetDeDes`;

/**
 * 🔹 Fonction générique pour interagir avec Supabase
 * @param {string} url - L'URL de l'API à interroger
 * @param {string} method - Méthode HTTP ("GET", "POST", etc.)
 * @param {object} body - (Optionnel) Données à envoyer
 * @returns {Promise<object>} - Retourne les données JSON de la réponse
 */
async function fetchSupabase(url, method = "GET", body = null) {
    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);
    return await response.json();
}

// 🔹 Charger la liste des personnages au démarrage
async function chargerPersonnages() {
    try {
        let data = await fetchSupabase(API_PERSONNAGES);
        console.log("📜 Liste des personnages :", data);

        let select = document.getElementById("playerSelect");
        select.innerHTML = ""; // 🔹 Vide la liste avant de la remplir

        data.forEach(personnage => {
            let option = document.createElement("option");
            option.value = personnage.ID;
            option.textContent = personnage.Nom;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}
document.addEventListener("DOMContentLoaded", chargerPersonnages);

/**
 * 🔹 Fonction pour lancer un dé et comparer avec la stat du personnage
 */
async function lancerDe(caracteristique) {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value;
    let joueurNom = select.options[select.selectedIndex].text;

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    try {
        let data = await fetchSupabase(`${API_PERSONNAGES}?ID=eq.${joueurID}&select=${caracteristique}`);
        if (data.length === 0) {
            console.error("❌ Aucun personnage trouvé avec cet ID !");
            return;
        }

        let statJoueur = data[0][caracteristique];
        let resultat = Math.floor(Math.random() * 100) + 1;

        let { reussite, cssClass } = getResultatClass(resultat, statJoueur);

        console.log(`🎲 ${joueurNom} (${caracteristique} : ${statJoueur}) a obtenu ${resultat} → ${reussite}`);

        // 🔹 Affichage dans l’interface
        afficherResultat({ Joueur: joueurNom, Caractéristique: caracteristique, Résultat: resultat, Issue: reussite });

        // 🔹 Envoi du jet de dé à Supabase
        await fetchSupabase(API_JETS, "POST", {
            Joueur: joueurNom,
            Caractéristique: caracteristique,
            Résultat: resultat,
            Issue: reussite
        });

        console.log("✅ Jet enregistré avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement du jet :", error);
    }
}

/**
 * 🔹 Fonction pour attribuer la classe CSS et le texte en fonction du résultat
 * @param {number} resultat - Le jet de dé (1 à 100)
 * @param {number} statJoueur - La caractéristique du joueur
 * @returns {object} - { reussite, cssClass }
 */
function getResultatClass(resultat, statJoueur) {
    if (resultat === 1) return { reussite: "Super Réussite Critique", cssClass: "SupReuCrit" };
    if (resultat <= 10) return { reussite: "Réussite Critique", cssClass: "ReuCrit" };
    if (resultat <= statJoueur) return { reussite: "Réussite", cssClass: "valide" };
    if (resultat === 100) return { reussite: "Super Échec Critique", cssClass: "SupEchecCrit" };
    if (resultat >= 90) return { reussite: "Échec Critique", cssClass: "EchecCrit" };
    return { reussite: "Échec", cssClass: "invalide" };
}

/**
 * 🔹 Fonction pour afficher le dernier résultat reçu
 */
function afficherResultat(jet) {
    let { cssClass } = getResultatClass(jet.Résultat, jet.Caractéristique);
    let resultatContainer = document.getElementById("resultat");
    resultatContainer.innerHTML = `
        <h3>Résultat du dé pour "<strong>${jet.Caractéristique}</strong>" :</h3>
        <h2 class="${cssClass}">${jet.Résultat} - ${jet.Issue}</h2>
        <p><small>(${jet.Joueur})</small></p>
    `;
}

// 🔹 Fonction pour charger l'historique des jets en temps réel
async function chargerHistorique() {
    try {
        let data = await fetchSupabase(`${API_JETS}?order=created_at.desc&limit=10`);
        afficherHistorique(data);
    } catch (error) {
        console.error("❌ Erreur lors du chargement de l'historique :", error);
    }
}

// 🔹 Fonction pour afficher l'historique des jets
function afficherHistorique(jets) {
    let historiqueContainer = document.getElementById("historique");
    historiqueContainer.innerHTML = ""; // Vide l'historique avant de le remplir

    jets.forEach(jet => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${jet.Caractéristique}</strong> : <span class="${getResultatClass(jet.Résultat, jet.Caractéristique).cssClass}">${jet.Résultat}</span> (${jet.Joueur})`;
        historiqueContainer.appendChild(li);
    });
}

// 🔹 Rafraîchir l'historique toutes les 5 secondes
setInterval(chargerHistorique, 5000);

// 🔹 Charger l'historique immédiatement au chargement de la page
document.addEventListener("DOMContentLoaded", chargerHistorique);

/**
 * 🔹 Charger le dernier résultat au démarrage
 */
async function chargerDernierJet() {
    try {
        let data = await fetchSupabase(`${API_JETS}?order=Timestamp.desc&limit=1`);
        if (data.length > 0) {
            afficherResultat(data[0]);
        }
    } catch (error) {
        console.error("❌ Erreur lors du chargement du dernier jet :", error);
    }
}
document.addEventListener("DOMContentLoaded", chargerDernierJet);
