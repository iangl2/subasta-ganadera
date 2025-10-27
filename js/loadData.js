
export async function cargarSubastas() {
  const response = await fetch("/demo/demo.json");
  const data = await response.json(); // Convertimos a objeto JS
  return data;
}