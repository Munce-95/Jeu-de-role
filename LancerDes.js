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

// 🔹 Fonction de génération de D100 utilisant ton algorithme personnalisé
function random_roll() {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);

    const randomNumber = randomArray[0] % 1000000;

    const thousands = Math.floor(randomNumber / 1000) % 10;
    const tens = Math.floor((randomNumber % 100) / 10);
    const result = (thousands === 0 && tens === 0) ? 100 : (thousands * 10 + tens);

    return result;
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
        let resultat = random_roll();
        let { reussite, cssClass } = getResultatClass(resultat, statJoueur);

        console.log(`🎲 ${joueurNom} (${caracteristique} : ${statJoueur}) → ${resultat} → ${reussite}`);

        // 🔹 Affichage privé du résultat
        document.getElementById("resultat").innerHTML = `
            <h3>Lancer pour <br>"<strong>${caracteristique}</strong>" :</h3>
            <h2 class="${cssClass}">${resultat} : ${reussite}</h2>
        `;

        // 🔹 Préparation des données pour Supabase
        let jetData = {
            Joueur: joueurNom,
            Caractéristique: caracteristique,
            Résultat: resultat,
            Issue: reussite,
            created_at: new Date().toISOString() // 🔹 Format correct pour timestamp
        };

        console.log("📤 Données envoyées à Supabase :", JSON.stringify(jetData, null, 2));

        // 🔹 Envoi du jet à l'historique Supabase
        let postResponse = await fetch(API_HISTORIQUE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Prefer": "return=representation"
            },
            body: JSON.stringify(jetData)
        });

        let responseData = await postResponse.json();
        console.log("✅ Réponse de Supabase :", responseData);

        if (responseData.error) {
            console.error("❌ Erreur lors de l'enregistrement :", responseData.error);
        } else {
            console.log("✅ Jet ajouté à l’historique !");
            chargerHistorique(); // 🔹 Mise à jour de l'historique
        }

    } catch (error) {
        console.error("❌ Erreur lors du jet :", error);
    }
}

// 🔹 Fonction pour lancer un dé neutre (MJ)
async function lancerDeNeutre() {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value;
    let joueurNom = select.options[select.selectedIndex].text;
    let resultat = random_roll(); // 🎲 Lancer D100

    console.log(`🎲 Dé 100 lancé → ${resultat}`);

    // 🔹 Affichage du jet neutre dans la section Résultat standard
    document.getElementById("resultat").innerHTML = `
        <h3>Lancer du "<strong>Dé 100</strong>" :</h3>
        <h2 class="neutre">${resultat}</h2>
    `;

    // 🔹 Enregistrement du jet dans Supabase (anonymisé)
    await fetch(API_HISTORIQUE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
            Joueur: joueurNom,
            Caractéristique: "Dé Neutre",
            Résultat: resultat,
            Issue: "-------------"
        })
    });

    console.log("✅ Jet neutre ajouté à l’historique !");
    chargerHistorique();
}

// 🔹 Fonction pour lancer des dégâts
async function lancerDegats() {
    let select = document.getElementById("playerSelect");
    let joueurID = select.value;
    let joueurNom = select.options[select.selectedIndex].text;

    if (!joueurID) {
        alert("Sélectionne un joueur !");
        return;
    }

    let degatsType = document.getElementById("degatsInput").value;
    degatsType = parseInt(degatsType, 10);

    if (isNaN(degatsType) || degatsType < 2) {
        alert("Entre un type de dé valide (ex: 6, 8, 10...) !");
        return;
    }

    let resultat = Math.floor(Math.random() * degatsType) + 1;

    console.log(`🎯 ${joueurNom} a lancé un D${degatsType} → ${resultat} dégâts`);

    // 🔹 Affichage dans le cadre des résultats
    document.getElementById("resultat").innerHTML = `
        <h3>Résultat pour "<strong>Dégâts (D${degatsType})</strong>" :</h3>
        <h2 class="degats">${resultat} dégâts</h2>
    `;

    // 🔹 Enregistrement dans l'historique
    await fetch(API_HISTORIQUE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
            Joueur: joueurNom,
            Caractéristique: `Dégâts (D${degatsType})`,
            Résultat: resultat,
            Issue: "Dégâts"
        })
    });

    console.log("✅ Jet de dégâts ajouté à l’historique !");
    chargerHistorique();
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

async function resetHistorique() {
    try {
        let response = await fetch(`${API_HISTORIQUE}?created_at=not.is.null`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Prefer": "return=minimal" // ✅ Permet d'éviter un retour inutile
            }
        });

        if (!response.ok) {
            let errorData = await response.json();
            console.error("❌ Erreur lors de la réinitialisation :", errorData);
            return;
        }

        console.log("✅ Historique réinitialisé avec succès !");
        chargerHistorique();
    } catch (error) {
        console.error("❌ Erreur réseau :", error);
    }
}



// 🔹 Fonction pour déterminer le type de réussite/échec
function getResultatClass(resultat, stat) {
    let cssClass = "invalide";
    let reussite = "Échec";

    if (resultat === 1) {
        cssClass = "SupReuCrit";
        reussite = "Super<br>Réussite Critique";
    } else if (resultat > 1 && resultat <= 10) {
        cssClass = "ReuCrit";
        reussite = "Réussite<br>Critique";
    } else if (resultat <= stat) {
        cssClass = "valide";
        reussite = "Réussite";
    } else if (resultat >= 90 && resultat < 100) {
        cssClass = "EchecCrit";
        reussite = "Échec<br>Critique";
    } else if (resultat === 100) {
        cssClass = "SupEchecCrit";
        reussite = "Super<br>Échec Critique";
    }

    return { reussite, cssClass };
}

// 🔹 Fonction pour afficher l’historique
function afficherHistorique(jets) {
    let historiqueContainer = document.getElementById("historique");
    historiqueContainer.innerHTML = ""; // Vide avant remplissage

    jets.forEach(jet => {
        let li = document.createElement("li");

        // Vérifier si c'est un jet de dégâts (on suppose qu'il contient "Dégâts")
        let isDegats = jet.Caractéristique.includes("Dégâts");
        let { reussite, cssClass } = getResultatClass(jet.Résultat, 50); // 50 = valeur par défaut

        // Définir la classe utilisée pour le résultat et l'issue
        let spanClass = isDegats ? "degats-histo" : cssClass;

        // 🔹 Appliquer la même classe CSS à Résultat + Issue
        li.innerHTML = `<strong>${jet.Caractéristique}</strong> : 
                        <span class="${spanClass}">${jet.Résultat}<br>${jet.Issue}</span><br>
                        <span>(${jet.Joueur})</span>`;

        historiqueContainer.appendChild(li);
    });
}




// 🔹 Rafraîchir l'historique toutes les 5 secondes
setInterval(chargerHistorique, 1000);
document.addEventListener("DOMContentLoaded", chargerHistorique);
