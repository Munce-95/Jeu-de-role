// 📌 URL de ton script Google Sheets
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzNN7FfscqGRSL0znhN9JPnjl-ePuOiAU4OJOZtSqzjgc8c2rfltHBaG7pOl5Cln3Qyzg/exec";

async function chargerPersonnages() {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        console.log("📜 Personnages chargés :", personnages);

        let select = document.getElementById("playerSelect");
        select.innerHTML = "";

        personnages.forEach(perso => {
            let option = document.createElement("option");
            option.value = perso.ID;
            option.textContent = perso.Nom;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
    }
}

async function lancerDe(caracteristique) {
    let playerID = document.getElementById("playerSelect").value;
    if (!playerID) {
        alert("Sélectionnez un personnage !");
        return;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        let personnage = personnages.find(perso => perso.ID == playerID);
        if (!personnage) {
            alert("Personnage introuvable !");
            return;
        }

        let stat = personnage[caracteristique];
        let jet = lancementDe();
        let verif = jet <= stat ? "Réussite" : "Échec";

        document.getElementById("resultat").innerText = 
            `Jet de ${caracteristique}: ${jet} // ${verif}`;
    } catch (error) {
        console.error("❌ Erreur lors du lancer de dé :", error);
    }
}

function lancementDe() {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    
    const randomNumber = randomArray[0] % 1000000;

    const thousands = Math.floor(randomNumber / 1000) % 10;
    const tens = Math.floor((randomNumber % 100) / 10);
    const result = (thousands === 0 && tens === 0) ? 100 : (thousands * 10 + tens);

    return result;
}

document.addEventListener("DOMContentLoaded", () => {
    chargerPersonnages();
});
