// 📌 URL de ton script Google Sheets
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyTjH0NGPhH2FNo9U8ci5nUOvBiulAtFxz3yqZWURhfl7qSu5OvXjUdSjoL43BagalHHA/exec";

document.addEventListener("DOMContentLoaded", async () => {
    let liste = document.getElementById("listePersonnages");
    liste.innerHTML = ""; // Réinitialisation

    try {
        // 📌 Récupération des personnages depuis Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL);
        const personnages = await response.json();

        if (!personnages || personnages.length === 0) {
            liste.innerHTML = "<p>Aucun personnage trouvé.</p>";
            return;
        }

        // 📌 Générer les boutons avec les noms récupérés
        personnages.forEach(personnage => {
            let nom = personnage.Nom || `Joueur ${personnage.ID}`;

            let bouton = document.createElement("button");
            bouton.innerText = nom;
            bouton.onclick = () => location.href = `FichePersonnage.html?id=${personnage.ID}`;

            liste.appendChild(bouton);
            liste.appendChild(document.createElement("br"));
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement des personnages :", error);
        liste.innerHTML = "<p>Erreur lors du chargement des personnages.</p>";
    }
});
