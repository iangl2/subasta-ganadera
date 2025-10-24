

import { cargarSubastas } from "./loadData.js";

// Asignación correcta usando await en módulo
const subastas = await cargarSubastas();

// Suponiendo que 'subastas' ya contiene el JSON de tus vacas
const productosContainer = document.getElementsByClassName("productos")[0];

productosContainer.innerText = ""; // Limpiar contenido previo
// Función para renderizar las tarjetas
function renderizarSubastas(subastas) {
  productosContainer.innerHTML = ""; // Limpiar contenido previo

  subastas.forEach((subasta, index) => {
    // Crear el artículo tarjeta
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    // Contenido de la tarjeta
    tarjeta.innerHTML = `
      <img src="${subasta.fotoSubasta}" alt="${subasta.nombreSubasta}">
      <h3>${subasta.nombreSubasta}</h3>
      <p>Puja más reciente: $${subasta.pujaMasReciente.toLocaleString()}</p>
      <p>Peso: ${subasta.peso} kg | Sexo: ${subasta.sexo} | Raza: ${subasta.raza}</p>
      <p>Vendedor: ${subasta.vendedor}</p>
      <a href="/pages/auction.html?id=${index}">
      <button class="show-more" >Ver más...</button>
      </a>
    `;

    productosContainer.appendChild(tarjeta);
  });
}

// Renderizar las subastas al cargar
renderizarSubastas(subastas);
