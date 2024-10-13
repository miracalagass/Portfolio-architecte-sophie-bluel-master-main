const gallery = document.querySelector(".gallery");
let projects = [];
let categories = [];

async function getAllProjects() {
    try {
        const response = await fetch("http://localhost:5678/api/works/");
        const data = await response.json();
        console.log(data);
        projects = data;
    } catch (error) {
        console.error("Erreur:", error);
    }
}

async function getCategories() {
    // Récupère les catégories via l'API et les assigne à la variable categories.
    try {
        const response = await fetch("http://localhost:5678/api/categories/");
        const data = await response.json();
        console.log(data);
        categories = data;
        return data;
    } catch (error) {
        console.error("Erreur:", error);
        return [];
    }
}

async function displayCategories() {
    // Crée dynamiquement le menu des filtres.
    const categories = await getCategories();
    const filterMenu = document.querySelector(".filter-menu");

    // Nettoyons le menu des filtres
    filterMenu.innerHTML = '';

    // Ajoutons le filtre par défaut "Tous"
    const allButton = document.createElement("button");
    allButton.classList.add("filter-button", "active");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => {
        filterProjects("Tous");
    });
    filterMenu.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.classList.add("filter-button");
        button.textContent = category.name;
        button.addEventListener("click", () => {
            filterProjects(category.name);
        });
        filterMenu.appendChild(button);
    });
}

function filterProjects(categoryName) {
    // Filtre les projets en fonction de la catégorie sélectionnée et les ajoute à la galerie.
    const filteredProjects = categoryName === "Tous" 
        ? projects 
        : projects.filter(project => {
            const category = categories.find(cat => cat.name === categoryName);
            return project.categoryId === category.id;
        });

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Nettoie la galerie

    filteredProjects.forEach(project => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-photo-id", project.id); // Ajoute l'ID

        const img = document.createElement("img");
        img.src = project.imageUrl;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = project.title; // ou le titre du projet
        figure.appendChild(figcaption);

        gallery.appendChild(figure); // Ajoute à la galerie
    });

    document.querySelectorAll(".filter-button").forEach(button => {
        button.classList.remove("active");
        if (button.textContent === categoryName) {
            button.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem("authToken");
    const loginButton = document.querySelector("nav ul li a[href='login.html']");
    const modifierButton = document.getElementById("edit-projects-btn");
    const editBar = document.getElementById("edit-bar");
    // Si l'utilisateur est connecté
    if (authToken) {
        document.body.classList.add('logged-in'); // Ajoute la classe logged-in
        loginButton.textContent = "Déconnexion"; // Change le bouton de connexion en déconnexion

        // Montre le bouton Modifier uniquement pour l'affichage admin
        if (modifierButton) {
            modifierButton.style.display = "block";
        }

        if (editBar) {
            editBar.style.display = "block"; // Montre la barre noire
        }

        // Déconnexion
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("authToken"); // Supprime le token
            document.body.classList.remove('logged-in'); // Supprime la classe logged-in
            window.location.href = "login.html"; // Redirige vers la page de connexion
        });
    } else {
        // Cache le bouton Modifier et la barre noire si l'utilisateur n'est pas connecté
        if (modifierButton) {
            modifierButton.style.display = "none";
        }

        if (editBar) {
            editBar.style.display = "none"; // Cache la barre noire
        }
    }
});

async function initializePage() {
    // Appelle les fonctions nécessaires pour initialiser la page.
    await displayAllProject();
    await displayCategories();
}

async function displayAllProject() {
    await getAllProjects();
    filterProjects("Tous");
}

initializePage();
