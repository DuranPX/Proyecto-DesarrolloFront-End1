document.addEventListener("DOMContentLoaded", async () => {
    
    fetch("http://localhost:5000/countries")
        .then(response => response.json())
        .then(data => {
            // Transformar la estructura del JSON recibido
            const countries = data.map(country => {
                const code = Object.keys(country)[0];
                return { code: code, name: country[code] };
            });

            const countryList = document.getElementById("countryList");
            const selectedFlag = document.getElementById("selectedFlag");
            const selectedCountry = document.getElementById("selectedCountry");
            const dropdownButton = document.getElementById("dropdownMenuButton");
            const dropdownMenu = document.getElementById("countryList");
            const codeBandera= document.getElementById("CodigoBandera_user");

            //ubicar imagenes en el menu
            countries.forEach(country => {
                const li = document.createElement("li");
                li.innerHTML = `
                <a class="dropdown-item" href="#" data-code="${country.code}" data-name="${country.name}">
                    <img src="https://flagcdn.com/40x30/${country.code}.png" class="flag-img" onerror="this.style.display='none'">
                    ${country.name}
                </a>`;
                countryList.appendChild(li);
            });

            //colocar bandera y nombre en su espacio
            countryList.addEventListener("click", (event) => {
                event.preventDefault();
                const target = event.target.closest("a");
                if (target) {
                    const countryCode = target.getAttribute("data-code");
                    const countryName = target.getAttribute("data-name");
                    codeBandera.textContent= countryCode;
                    selectedFlag.src = `https://flagcdn.com/w320/${countryCode}.png`;
                    selectedFlag.hidden = false;
                    selectedCountry.textContent = countryName;
                }
            });
            
            //Menu desplegable
            dropdownButton.addEventListener("click", (event) => {
                event.stopPropagation(); // Evita que se cierre por otros clics
                dropdownMenu.classList.toggle("d-none");
            });
        
            document.addEventListener("click", (event) => {
                if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.classList.add("d-none"); // Cierra el menú si se hace clic fuera
                }
            });
        })
        .catch(error => console.error("Error cargando los paises rey:", error));

});
