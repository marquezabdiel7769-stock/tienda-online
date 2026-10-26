// --- DEFINICIÓN DE PRODUCTOS ---
const productos = [
    { id: 1, nombre: "Mouse Óptico Inalámbrico", precio: 350.00, categoria: "Accesorios" },
    { id: 2, nombre: "Teclado Mecánico RGB", precio: 899.00, categoria: "Accesorios" },
    { id: 3, nombre: "Monitor Full HD 24 pulgadas", precio: 3249.00, categoria: "Pantallas" },
    { id: 4, nombre: "Audífonos Gamer con Micrófono", precio: 650.00, categoria: "Audio" },
    { id: 5, nombre: "Memoria USB 64GB 3.0", precio: 180.00, categoria: "Almacenamiento" }
];

let carrito = [];

// FASE 4: Función JavaScript para avisos temporales
let temporizadorAviso;
function notificar(mensaje) {
    const caja = document.querySelector("#notificacion");
    if (!caja) return;
    caja.textContent = mensaje;
    caja.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
        caja.classList.remove("visible");
    }, 2400);
}

// FASE 5: Sonidos sin archivos usando Web Audio API
function sonido(frecuencia = 660) {
    const AudioContexto = window.AudioContext || window.webkitAudioContext;
    if (!AudioContexto) return;
    const contexto = new AudioContexto();
    const oscilador = contexto.createOscillator();
    const volumen = contexto.createGain();
    
    oscilador.type = "sine";
    oscilador.frequency.value = frecuencia;
    volumen.gain.setValueAtTime(0.07, contexto.currentTime);
    volumen.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.15);
    
    oscilador.connect(volumen);
    volumen.connect(contexto.destination);
    
    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.15);
    oscilador.onended = () => contexto.close();
}

// FASE 7: Persistencia del carrito con localStorage
function guardarCarrito() {
    localStorage.setItem("carritoTienda", JSON.stringify(carrito));
}

function recuperarCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem("carritoTienda") || "[]");
        carrito = Array.isArray(datos) ? datos.filter(item => 
            productos.some(producto => producto.id === item.id)
        ) : [];
    } catch (error) {
        carrito = [];
        console.warn("Carrito guardado no válido", error);
    }
}

// FASE 6: Integración en operaciones del carrito (Lógica funcional)
function agregarProducto(id) {
    const encontrado = productos.find(p => p.id === id);
    if (!encontrado) return;
    
    // Agregamos el producto al carrito usando spread operator
    carrito = [...carrito, encontrado];
    
    guardarCarrito();
    sonido(780);
    notificar("Producto agregado al carrito");
    mostrarCarrito();
}

function quitarProducto(index) {
    // Quitamos el producto según su posición en el arreglo del carrito
    carrito.splice(index, 1);
    
    guardarCarrito();
    sonido(420);
    notificar("Producto retirado");
    mostrarCarrito();
}

// Manejador del botón vaciar
document.querySelector("#vaciar")?.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    sonido(330);
    notificar("Carrito vaciado");
    mostrarCarrito();
});

// FASE 8 & Funcionalidad del Carrito: Actualización visual del contador y resumen
function mostrarCarrito() {
    // Actualizar contador visual antes del resumen
    const contadorEl = document.querySelector("#contador");
    if (contadorEl) {
        contadorEl.textContent = carrito.length;
    }
    
    const resumenEl = document.querySelector("#resumen");
    if (!resumenEl) return;

    resumenEl.innerHTML = "";

    if (carrito.length === 0) {
        resumenEl.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;
    const lista = document.createElement("ul");

    carrito.forEach((item, index) => {
        total += item.precio;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - $${item.precio.toFixed(2)} MXN 
            <button onclick="quitarProducto(${index})">Eliminar</button>
        `;
        lista.appendChild(li);
    });

    resumenEl.appendChild(lista);

    const totalEl = document.createElement("p");
    totalEl.innerHTML = `<strong>Total: $${total.toFixed(2)} MXN</strong>`;
    resumenEl.appendChild(totalEl);
}

// Renderizar el catálogo de productos automáticamente en la página
function mostrarCatalogo() {
    const contenedorCatalogo = document.querySelector("#catalogo");
    if (!contenedorCatalogo) return;

    contenedorCatalogo.innerHTML = "";

    productos.forEach(producto => {
        const article = document.createElement("article");
        article.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p><strong>$${producto.precio.toFixed(2)} MXN</strong></p>
            <button onclick="agregarProducto(${producto.id})">Agregar al carrito</button>
        `;
        contenedorCatalogo.appendChild(article);
    });
}

// FASE 10: Control de reproducción de video con JavaScript
const video = document.querySelector("#videoTienda");
document.querySelector("#reproducirVideo")?.addEventListener("click", () => {
    if (video) {
        video.play().catch(() => 
            notificar("Agrega videos/demo.mp4 para reproducirlo")
        );
    }
});

document.querySelector("#pausarVideo")?.addEventListener("click", () => {
    if (video) {
        video.pause();
    }
});

// Inicialización al cargar el script
document.addEventListener("DOMContentLoaded", () => {
    mostrarCatalogo();
    recuperarCarrito();
    mostrarCarrito();
});