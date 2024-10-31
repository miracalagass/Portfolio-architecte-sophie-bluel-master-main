document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        console.log("Formulaire de connexion trouvé."); 

        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Email et mot de passe récupérés :", email, password);

            // Contrôle regex pour l'email
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
            if (!emailRegex.test(email)) {
                alert("Veuillez entrer une adresse e-mail valide.");
                return; // Hatalı e-posta girildiğinde işlemi durdur
            }

            // Contrôle regex pour le mot de passe (Au moins 6 caractères, une majuscule, une minuscule et un chiffre)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
            if (!passwordRegex.test(password)) {
                alert("Le mot de passe doit comporter au moins 6 caractères, incluant une majuscule, une minuscule et un chiffre."); // Hatalı şifre
                return; // Hatalı şifre girildiğinde işlemi durdur
            }

            try {
                console.log("Envoi de la requête API...");

                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("authToken", data.token); // Token'ı localStorage'a kaydet

                    // Redirige vers la page d'accueil après une connexion réussie
                    window.location.href = "index.html"; // Giriş başarılı olduğunda ana sayfaya yönlendir
                } else {
                    document.getElementById("error-message").style.display = "block"; // Affiche le message d'erreur
                }
            } catch (error) {
                console.error("Erreur de connexion :", error);
            }
        });
    } else {
        console.log("Formulaire de connexion non trouvé !"); // Eğer form bulunamazsa
    }
});
