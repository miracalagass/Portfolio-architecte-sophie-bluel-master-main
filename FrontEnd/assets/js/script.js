const gallery = document.querySelector(".gallery");
let projects = [];
let categories = [];

async function getAllProjects() {
    try {
        const response = await fetch("http://localhost:5678/api/works/");
        const data = await response.json();
        console.log(data)
        projects = data;
    } catch (error) {
        console.error("Erreur:", error);
    }
}

async function getCategories() {
    //Kategorileri API'den alır ve categories değişkenine atar.
    try {
        const response = await fetch("http://localhost:5678/api/categories/");
        const data = await response.json();
        console.log(data)
        categories = data;
        return data;
    } catch (error) {
        console.error("Erreur:", error);
        return [];
    }
}

async function displayCategories() {
    //Filtre menüsünü dinamik olarak oluşturur.
    const categories = await getCategories();
    const filterMenu = document.querySelector(".filter-menu");

    // Filtre menüsünü temizleyelim
    filterMenu.innerHTML = '';

    // Varsayılan "Tous" filtresini ekleyelim
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
    //Seçilen kategoriye göre projeleri filtreler ve galeriye ekler.
    const filteredProjects = categoryName === "Tous" 
        ? projects 
        : projects.filter(project => {
            const category = categories.find(cat => cat.name === categoryName);
            return project.categoryId === category.id;
        });

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    filteredProjects.forEach(project => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = project.title; // veya projenin ismi/title
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });

    document.querySelectorAll(".filter-button").forEach(button => {
        button.classList.remove("active");
        if (button.textContent === categoryName) {
            button.classList.add("active");
        }
    });
}

async function initializePage() {
    //Sayfayı başlatmak için gerekli olan işlevleri çağırır.
    await displayAllProject();
    await displayCategories();
}

async function displayAllProject() {
    await getAllProjects();
    filterProjects("Tous");
}

initializePage();
