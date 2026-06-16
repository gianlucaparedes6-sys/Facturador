let ultimoProductoEliminado = null;
let productos = []; // Productos agregados a la factura actual

   //PERSISTENCIA DE PRODUCTOS (CON / SIN IVA)
const productosPorDefecto = [
  { nombre: "Arroz", precio: 2.50, iva: true },
  { nombre: "Leche", precio: 1.20, iva: true },
  { nombre: "Pan", precio: 0.50, iva: false },
  { nombre: "Queso", precio: 3.00, iva: true },
  { nombre: "Agua", precio: 0.80, iva: false }
];

// Cargar productos guardados o usar los por defecto
let listaProductos = JSON.parse(localStorage.getItem("productos_sistema")) || productosPorDefecto;

function mostrarTodos() {
    pintarProductos(listaProductos);
}

function mostrarConIva() {
    pintarProductos(listaProductos.filter(p => p.iva));
}

function mostrarSinIva() {
    pintarProductos(listaProductos.filter(p => !p.iva));
}

function pintarProductos(lista) {
    let contenido = "";

    for (let i = 0; i < lista.length; i++) {
        let ivaPorcentaje = lista[i].iva ? 15 : 0;
        let ivaValor = lista[i].precio * (ivaPorcentaje / 100);
        let total = lista[i].precio + ivaValor;

        contenido += `
        <tr>
            <td>${lista[i].nombre}</td>
            <td>$${lista[i].precio.toFixed(2)}</td>
            <td>${ivaPorcentaje}%</td>
            <td>$${ivaValor.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td>
                <button onclick="eliminarProductoLista('${lista[i].nombre}')">X</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tablaProductosLista").innerHTML = contenido;
}

function agregarProductoLista() {
    let nombre = document.getElementById("nuevoProducto").value.trim();
    let precio = parseFloat(document.getElementById("nuevoPrecio").value);
    let iva = document.getElementById("nuevoIva").value === "true";

    if (nombre === "" || isNaN(precio) || precio <= 0) {
        alert("Completa los datos correctamente");
        return;
    }

    // Evitar duplicados con el mismo nombre
    let existe = listaProductos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        alert("Este producto ya está registrado. Si deseas cambiar su precio, elimínalo primero.");
        return;
    }

    listaProductos.push({ nombre, precio, iva });

    // GUARDAR EN EL NAVEGADOR
    localStorage.setItem("productos_sistema", JSON.stringify(listaProductos));

    document.getElementById("nuevoProducto").value = "";
    document.getElementById("nuevoPrecio").value = "";

    pintarProductos(listaProductos);
    asignarAutocompletadoFactura(); 
}

function eliminarProductoLista(nombreProducto) {
    listaProductos = listaProductos.filter(p => p.nombre !== nombreProducto);
    localStorage.setItem("productos_sistema", JSON.stringify(listaProductos));
    pintarProductos(listaProductos);
}

   //CONEXIÓN: AUTOCOMPLETAR PRECIO EN FACTURACIÓN
function asignarAutocompletadoFactura() {
    let inputProductoFactura = document.getElementById("producto");
    if (!inputProductoFactura) return;

    inputProductoFactura.addEventListener("input", function() {
        let textoEscrito = this.value.trim().toLowerCase();
        let precioInput = document.getElementById("precio");
        let ivaSelectFactura = document.getElementById("iva");

        let productoEncontrado = listaProductos.find(p => p.nombre.toLowerCase() === textoEscrito);

        if (productoEncontrado) {
            precioInput.value = productoEncontrado.precio;
            
            if (ivaSelectFactura) {
                ivaSelectFactura.value = productoEncontrado.iva ? 15 : 0;
                calcularTotales();
            }
        }
    });
}

   //AGREGAR PRODUCTO A LA FACTURA ACTUAL
function agregarProducto() {
    let productoInput = document.getElementById("producto").value.trim();
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let precio = parseFloat(document.getElementById("precio").value);

    if (productoInput === "" || cantidad <= 0 || precio <= 0 || isNaN(cantidad) || isNaN(precio)) {
        alert("Complete los datos correctamente");
        return;
    }

    let productoEncontrado = listaProductos.find(p => p.nombre.toLowerCase() === productoInput.toLowerCase());
    let precioConIva = precio;

    if (productoEncontrado && productoEncontrado.iva) {
        precioConIva = precio * 1.15;
    }

    let subtotal = cantidad * precioConIva;

    productos.push({
        producto: productoInput,
        cantidad: cantidad,
        precio: precioConIva,
        subtotal: subtotal
    });

    pintarTabla();
    limpiarInputs();
}

function pintarTabla() {
    let contenido = "";

    for (let i = 0; i < productos.length; i++) {
        contenido += `
        <tr>
            <td>${productos[i].producto}</td>
            <td>${productos[i].cantidad}</td>
            <td>$ ${productos[i].precio.toFixed(2)}</td>
            <td>$ ${productos[i].subtotal.toFixed(2)}</td>
            <td>
                <button onclick="eliminarProducto(${i})">X</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tablaProductos").innerHTML = contenido;
    calcularTotales();
}

function eliminarProducto(posicion) {
    productos.splice(posicion, 1);
    pintarTabla();
}

function calcularTotales() {
    let totalGeneral = 0;
    
    for (let i = 0; i < productos.length; i++) {
        totalGeneral += productos[i].subtotal;
    }
    let subtotalSinIva = totalGeneral / 1.15;
    let valorIvaDesglosado = totalGeneral - subtotalSinIva;
    document.getElementById("subtotal").innerHTML = "$ " + subtotalSinIva.toFixed(2);
    document.getElementById("valorIva").innerHTML = "$ " + valorIvaDesglosado.toFixed(2);
    document.getElementById("total").innerHTML = "$ " + totalGeneral.toFixed(2);
}

function limpiarInputs() {
    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("precio").value = "";
}

   //NAVEGACIÓN DE SECCIONES
function mostrarSeccion(id) {
    let secciones = document.getElementsByClassName("seccion");

    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }

    document.getElementById(id).style.display = "block";
}

  // GESTIÓN DE CLIENTES
let clientes = JSON.parse(localStorage.getItem("clientes_sistema")) || [];

function guardarCliente() {
    let nombre = document.getElementById("nombreCliente").value;
    let cedula = document.getElementById("cedulaCliente").value;

    if (nombre === "" || cedula === "") {
        alert("Complete los datos");
        return;
    }

    clientes.push({
        nombre: nombre,
        cedula: cedula,
        telefono: document.getElementById("telefonoCliente").value,
        correo: document.getElementById("correoCliente").value
    });

    localStorage.setItem("clientes_sistema", JSON.stringify(clientes));
    pintarClientes();
    limpiarClientes();
}

function buscarCliente() {
    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedulaBuscar) {
            document.getElementById("nombreCliente").value = clientes[i].nombre;
            document.getElementById("telefonoCliente").value = clientes[i].telefono;
            document.getElementById("correoCliente").value = clientes[i].correo;
            encontrado = true;
        }
    }

    if (!encontrado) {
        alert("Cliente no encontrado");
    }
}

function modificarCliente() {
    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedulaBuscar) {
            clientes[i].nombre = document.getElementById("nombreCliente").value;
            clientes[i].telefono = document.getElementById("telefonoCliente").value;
            clientes[i].correo = document.getElementById("correoCliente").value;
            encontrado = true;
        }
    }

    if (encontrado) {
        localStorage.setItem("clientes_sistema", JSON.stringify(clientes));
        pintarClientes();
        limpiarClientes();
        alert("Cliente modificado");
    } else {
        alert("Cliente no encontrado");
    }
}

function pintarClientes() {
    let contenido = "";

    for (let i = 0; i < clientes.length; i++) {
        contenido += `
        <tr>
            <td>${clientes[i].nombre}</td>
            <td>${clientes[i].cedula}</td>
            <td>${clientes[i].telefono}</td>
            <td>${clientes[i].correo}</td>
            <td><button onclick="eliminarCliente(${i})">X</button></td>
        </tr>
        `;
    }

    document.getElementById("tablaClientes").innerHTML = contenido;
}

function eliminarCliente(posicion) {
    clientes.splice(posicion, 1);
    localStorage.setItem("clientes_sistema", JSON.stringify(clientes));
    pintarClientes();
}

function limpiarClientes() {
    document.getElementById("nombreCliente").value = "";
    document.getElementById("cedulaCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("correoCliente").value = "";
}

function buscarClienteFactura() {
    let cedulaBuscar = document.getElementById("cedula").value;
    let encontrado = false;

    if (cedulaBuscar === "") {
        alert("Por favor, ingrese una cédula para buscar.");
        return;
    }

    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedulaBuscar) {
            document.getElementById("cliente").value = clientes[i].nombre;
            document.getElementById("telefono").value = clientes[i].telefono;
            document.getElementById("correo").value = clientes[i].correo;
            encontrado = true;
            break; 
        }
    }
    if (!encontrado) {
        alert("Cliente no registrado en el sistema. Puede ingresar los datos manualmente.");
    }
}

   //PROCESAR PRODUCTOS PORTADA / MINI FACTURA MANUAL
function guardarProductos() {
    let nomProd1 = document.getElementById("primerProducto").value;
    let precProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;
    let nomProd2 = document.getElementById("segundoProducto").value;
    let precProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;

    precProd1 = Math.abs(precProd1);
    precProd2 = Math.abs(precProd2);

    if (nomProd1 === "" || nomProd2 === "" || precProd1 <= 0 || precProd2 <= 0) {
        alert("Por favor, complete los nombres y precios de ambos productos.");
        return;
    }

    let sumaSubtotal = precProd1 + precProd2;

    let estructuraResultado = `
        <div class="card" style="border: 2px solid #2563eb;">
            <h2 style="color: #2563eb; margin-bottom: 10px;">Resumen de Productos</h2>
            <p style="margin-bottom: 5px;"><strong>Producto 1:</strong> ${nomProd1} — $ ${precProd1.toFixed(2)}</p>
            <p style="margin-bottom: 10px;"><strong>Producto 2:</strong> ${nomProd2} — $ ${precProd2.toFixed(2)}</p>
            <div style="border-top: 1px solid #ddd; padding-top: 10px;">
                <h3>Suma Total: $ ${sumaSubtotal.toFixed(2)}</h3>
            </div>
        </div>
    `;

    document.getElementById("resultadoPortada").innerHTML = estructuraResultado;
}

function proIVA1() {
    let precioProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;
    let porcentajeIva1 = parseFloat(document.getElementById("porcentajeDeIVA1").value) || 0;

    if (precioProd1 <= 0) {
        alert("Por favor, primero ingrese el precio del Producto 1.");
        return;
    }

    let valorIva1 = (precioProd1 * porcentajeIva1) / 100;

    document.getElementById("resultadoIVA1").innerHTML = `
        <div style="background: #f0f4f8; padding: 15px; border-radius: 5px; margin-top: 8px; border-left: 4px solid #2563eb;">
            <strong>Fórmula:</strong> (Precio × Porcentaje) ÷ 100 <br>
            <strong>Resultado IVA 1:</strong> <span style="color: #2563eb; font-weight: bold;">$ ${valorIva1.toFixed(2)}</span>
        </div>
    `;
}

function proIVA2() {
    let precioProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;
    let porcentajeIva2 = parseFloat(document.getElementById("porcentajeDeIVA2").value) || 0;

    if (precioProd2 <= 0) {
        alert("Por favor, primero ingrese el precio del Producto 2.");
        return;
    }

    let valorIva2 = (precioProd2 * porcentajeIva2) / 100;

    document.getElementById("resultadoIVA2").innerHTML = `
        <div style="background: #f0f4f8; padding: 15px; border-radius: 5px; margin-top: 8px; border-left: 4px solid #2563eb;">
            <strong>Fórmula:</strong> (Precio × Porcentaje) ÷ 100 <br>
            <strong>Resultado IVA 2:</strong> <span style="color: #2563eb; font-weight: bold;">$ ${valorIva2.toFixed(2)}</span>
        </div>
    `;
}

function total() {
    let nomProd1 = document.getElementById("primerProducto").value || "Producto 1";
    let precProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;
    let nomProd2 = document.getElementById("segundoProducto").value || "Producto 2";
    let precProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;

    let porcIva1 = parseFloat(document.getElementById("porcentajeDeIVA1").value) || 0;
    let porcIva2 = parseFloat(document.getElementById("porcentajeDeIVA2").value) || 0;

    if (precProd1 <= 0 && precProd2 <= 0) {
        alert("Por favor, ingrese precios válidos antes de calcular.");
        return;
    }

    let ivaCalculado1 = (precProd1 * porcIva1) / 100;
    let totalProd1 = precProd1 + ivaCalculado1;

    let ivaCalculado2 = (precProd2 * porcIva2) / 100;
    let totalProd2 = precProd2 + ivaCalculado2;

    let subtotalGeneral = precProd1 + precProd2;
    let ivaGeneral = ivaCalculado1 + ivaCalculado2;
    let totalNeto = totalProd1 + totalProd2;

    let estructuraHTML = `
        <div id="seccionImprimible" style="padding: 20px; border: 1px dashed #1f3c88; border-radius: 5px; background: #fafafa; margin-top: 15px; color: #000;">
            <h3 style="text-align: center; color: #1f3c88; margin-bottom: 15px;">RESUMEN DE COBRO DETALLADO</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; color: #000;">
                <thead>
                    <tr style="background: #1f3c88; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Descripción</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Precio Base</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">IVA %</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Valor IVA</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">${nomProd1}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${precProd1.toFixed(2)}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${porcIva1}%</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${ivaCalculado1.toFixed(2)}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${totalProd1.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">${nomProd2}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${precProd2.toFixed(2)}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${porcIva2}%</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${ivaCalculado2.toFixed(2)}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">$ ${totalProd2.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <div style="width: 250px; margin-left: auto; font-size: 1.1em; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between;">
                    <span><strong>Subtotal:</strong></span> <span>$ ${subtotalGeneral.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span><strong>Total IVA:</strong></span> <span>$ ${ivaGeneral.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 2px solid #1f3c88; padding-top: 5px; margin-top: 5px; color: #0b2c81;">
                    <span><strong>TOTAL NETO:</strong></span> <strong>$ ${totalNeto.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    `;
    document.getElementById("facturaFinalPortadas").innerHTML = estructuraHTML;
}

function imprimirPDF() {
    let verificarContenido = document.getElementById("facturaFinalPortadas").innerHTML;
    if (verificarContenido.trim() === "") {
        alert("Primero debe calcular el total para poder imprimir.");
        return;
    }
    window.print();
}

//INICIALIZACIÓN DEL SISTEMA
pintarClientes();
pintarProductos(listaProductos);
asignarAutocompletadoFactura();

// ==========================================================================
// GESTIÓN DE TEMA CLARO / OSCURO (PERSISTENTE)
// ==========================================================================
function alternarTema() {
    const body = document.body;
    const boton = document.getElementById("btn-tema");
    
    body.classList.toggle("light-theme");
    
    if (body.classList.contains("light-theme")) {
        boton.innerHTML = "☀️ Modo Claro";
        localStorage.setItem("tema_sistema", "claro");
    } else {
        boton.innerHTML = "🌙 Modo Oscuro";
        localStorage.setItem("tema_sistema", "oscuro");
    }
}

(function cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem("tema_sistema");
    const boton = document.getElementById("btn-tema");
    
    if (temaGuardado === "claro" && boton) {
        document.body.classList.add("light-theme");
        boton.innerHTML = "☀️ Modo Claro";
    }
})();