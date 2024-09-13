document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        console.log("Formulaire de connexion trouvé."); // Test amaçlı log

        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            console.log("Email et mot de passe récupérés :", email, password); // Test amaçlı log

            // Email regex kontrolü
            const emailRegex =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
            if (!emailRegex.test(email)) {
                alert("Veuillez entrer une adresse e-mail valide.");
                return; // Hatalı e-posta adresi girildiğinde işlemi durdur
            }

            // Şifre regex kontrolü (En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermeli)
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
            if (!passwordRegex.test(password)) {
                alert("Le mot de passe doit comporter au moins 6 caractères, incluant une majuscule, une minuscule et un chiffre.");
                return; // Hatalı şifre girildiğinde işlemi durdur
            }

            try {
                console.log("Envoi de la requête API..."); // Test amaçlı log

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
                    window.location.href = "index.html"; // Başarılı giriş durumunda ana sayfaya yönlendir
                } else {
                    document.getElementById("error-message").style.display = "block"; // Hata mesajını göster
                }
            } catch (error) {
                console.error("Erreur de connexion:", error);
            }
        });
    } else {
        console.log("Formulaire de connexion non trouvé!"); // Eğer form bulunamazsa
    }
});
