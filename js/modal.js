const modal = document.getElementsByClassName('wrapper')[0];
const openModalBtn = document.getElementsByClassName('crear-subasta')[0];
// Esperar a que el DOM esté completamente cargado

    // Obtener elementos del DOM
    const closeModalBtn = document.getElementById('close-modal');
    console.log(closeModalBtn);
    
    // Función para abrir el modal
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevenir scroll en el fondo
    }
    
    // Función para cerrar el modal
    function closeModal() {
        console.log('Cerrando modal');
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    // Event listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Ocultar modal inicialmente
    modal.style.display = 'none';

