// 🔹 Initialisation de Supabase
const SUPABASE_URL = "https://sxwltroedzxkvqpbcqjc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d2x0cm9lZHp4a3ZxcGJjcWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQxNzIsImV4cCI6MjA1NjAwMDE3Mn0.F_XIxMSvejY2xLde_LbLcLt564fiW2zF-wqr95rZ2zA";
const API_RESUMES = `${SUPABASE_URL}/rest/v1/resumes`;

// 📌 Charger la liste des résumés
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

        console.log("📜 Données reçues de Supabase :", data);

        let liste = document.getElementById("listeResumes");
        if (!liste) return; // Vérification d'existence
        liste.innerHTML = "";

        if (!data || data.length === 0) {
            console.warn("⚠️ Aucun résumé trouvé !");
            return;
        }

        data.forEach(resume => {
            let bouton = document.createElement("button");
            bouton.innerText = resume.Titre;
            bouton.onclick = () => location.href = `ResumeDetail.html?id=${resume.id}`;
            liste.appendChild(bouton);
        });
    } catch (error) {
        console.error("❌ Erreur chargement des résumés :", error);
    }
}

// 🔹 Ajouter un résumé
async function ajouterResume() {
    let titre = prompt("Titre du résumé :");
    if (!titre) return;

    let response = await fetch(API_RESUMES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Prefer": "return=representation"
        },
        body: JSON.stringify({
            Titre: titre,
            Contenu: ""
        })
    });

    let responseData = await response.json();
    console.log("📜 Nouveau résumé ajouté :", responseData);

    if (response.ok) {
        console.log("✅ Résumé ajouté !");
        location.href = `ResumeDetail.html?id=${responseData[0].id}`; // Redirection après ajout
    } else {
        console.error("❌ Erreur lors de l'ajout :", responseData);
    }
}

// 🔹 Charger un résumé spécifique dans ResumeDetail.html
async function chargerResume() {
    let params = new URLSearchParams(window.location.search);
    let resumeID = params.get("id");

    if (!resumeID) {
        alert("Résumé introuvable !");
        location.href = "Resume.html";
        return;
    }

    console.log("📜 Chargement du résumé ID :", resumeID);

    try {
        let response = await fetch(`${API_RESUMES}?id=eq.${resumeID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            }
        });

        let data = await response.json();

        if (data.length === 0) {
            alert("Résumé introuvable !");
            location.href = "Resume.html";
            return;
        }

        console.log("📜 Données du résumé :", data);
        document.getElementById("titreResume").textContent = `Résumé : ${data[0].Titre}`;
        document.getElementById("contenuResume").value = data[0].Contenu;
    } catch (error) {
        console.error("❌ Erreur chargement du résumé :", error);
    }
}

// 🔹 Sauvegarder le résumé
async function sauvegarderResume() {
    let params = new URLSearchParams(window.location.search);
    let resumeID = params.get("id");
    let contenu = document.getElementById("contenuResume").value;

    if (!resumeID) {
        console.error("❌ Impossible de sauvegarder, ID manquant !");
        return;
    }

    try {
        let response = await fetch(`${API_RESUMES}?id=eq.${resumeID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY
            },
            body: JSON.stringify({ Contenu: contenu })
        });

        if (response.ok) {
            console.log("✅ Résumé sauvegardé !");
            alert("Résumé enregistré !");
        } else {
            console.error("❌ Erreur lors de la sauvegarde :", await response.json());
        }
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
