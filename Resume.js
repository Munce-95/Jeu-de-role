// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_RESUMES = `${SUPABASE_URL}/rest/v1/resumes`;

// 📌 Charger la liste des résumés au démarrage
document.addEventListener("DOMContentLoaded", chargerResumes);

async function chargerResumes() {
    try {
        let response = await fetch(API_RESUMES, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        // 🔍 Vérification des données
        console.log("📜 Données reçues de Supabase :", data);

        let liste = document.getElementById("listeResumes");
        liste.innerHTML = ""; // 🔄 Vide la liste avant de la remplir

        if (!data || data.length === 0) {
            console.warn("⚠️ Aucun résumé trouvé !");
            return;
        }

        data.forEach(resume => {
            console.log("📝 Résumé ID :", resume.ID); // Vérifier si Supabase envoie bien l'ID

            let bouton = document.createElement("button");
            bouton.innerText = resume.Titre;
            bouton.onclick = () => location.href = `ResumeDetail.html?id=${resume.ID}`;

            liste.appendChild(bouton);
        });
    } catch (error) {
        console.error("❌ Erreur chargement des résumés :", error);
    }
}

async function ajouterResume() {
    let titre = prompt("Titre du résumé :");
    if (!titre) return;

    let response = await fetch(API_RESUMES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Prefer": "return=representation" // ✅ On demande à Supabase de renvoyer les infos créées
        },
        body: JSON.stringify({
            Titre: titre,
            Contenu: ""
        })
    });

    let data = await response.json();

    if (response.ok && data.length > 0) {
        console.log("✅ Résumé ajouté :", data);
        let newID = data[0].ID; // 🔹 Récupère l'ID du résumé créé

        // 🏃 Rediriger directement vers la page du résumé
        window.location.href = `ResumeDetail.html?id=${newID}`;
    } else {
        console.error("❌ Erreur lors de l'ajout :", data);
    }
}


// 📌 Fonction pour charger un résumé spécifique
async function chargerResume() {
    let params = new URLSearchParams(window.location.search);
    let resumeID = params.get("id");

    if (!resumeID) {
        alert("Résumé introuvable !");
        location.href = "Resume.html"; // Retour si l'ID est manquant
        return;
    }

    console.log("🔍 Chargement du résumé ID :", resumeID);

    try {
        let response = await fetch(`${API_RESUMES}?ID=eq.${resumeID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();
        console.log("📜 Données du résumé :", data);

        if (!data || data.length === 0) {
            alert("Résumé introuvable !");
            location.href = "Resume.html";
            return;
        }

        document.getElementById("titreResume").textContent = data[0].Titre;
        document.getElementById("contenuResume").value = data[0].Contenu;
    } catch (error) {
        console.error("❌ Erreur chargement du résumé :", error);
    }
}

// 📌 Charger un résumé si on est sur `ResumeDetail.html`
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("contenuResume")) {
        chargerResume();
    }
});


// 📌 Fonction pour sauvegarder un résumé
async function sauvegarderResume() {
    let params = new URLSearchParams(window.location.search);
    let resumeID = params.get("id");
    let contenu = document.getElementById("contenuResume").value;

    try {
        await fetch(`${API_RESUMES}?ID=eq.${resumeID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify({ Contenu: contenu })
        });

        console.log("✅ Résumé sauvegardé !");
        alert("Résumé enregistré !");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

// 📌 Charger un résumé si on est sur `ResumeDetail.html`
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("contenuResume")) {
        chargerResume();
    }
});
