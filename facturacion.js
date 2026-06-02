/* =========================
   FACTURACIÓN
========================= */

let productos = [];

/* =========================
   AGREGAR PRODUCTO
========================= */

function agregarProducto() {

    let producto = document.getElementById("producto").value;
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let precio = parseFloat(document.getElementById("precio").value);

    if (producto == "" || precio <= 0 || cantidad <= 0) {
        alert("Complete los datos correctamente");
        return;
    }

    let subtotal = cantidad * precio;

    let item = {
        producto: producto,
        cantidad: cantidad,
        precio: precio,
        subtotal: subtotal
    };

    productos.push(item);

    pintarTabla();
    limpiarInputs();
}

/* =========================
   PINTAR TABLA FACTURA
========================= */

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
                <button class="eliminar" onclick="eliminarProducto(${i})">X</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tablaProductos").innerHTML = contenido;

    calcularTotales();
}

/* =========================
   ELIMINAR PRODUCTO
========================= */

function eliminarProducto(posicion) {

    productos.splice(posicion, 1);
    pintarTabla();
}

/* =========================
   CALCULAR TOTALES
========================= */

function calcularTotales() {

    let subtotal = 0;

    for (let i = 0; i < productos.length; i++) {
        subtotal += productos[i].subtotal;
    }

    let ivaPorcentaje = parseFloat(document.getElementById("iva").value);

    let iva = subtotal * (ivaPorcentaje / 100);
    let total = subtotal + iva;

    document.getElementById("subtotal").innerHTML = "$ " + subtotal.toFixed(2);
    document.getElementById("valorIva").innerHTML = "$ " + iva.toFixed(2);
    document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}

/* =========================
   LIMPIAR INPUTS
========================= */

function limpiarInputs() {

    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("precio").value = "";
}

/* =========================
   MOSTRAR SECCIONES
========================= */

function mostrarSeccion(id) {

    let secciones = document.getElementsByClassName("seccion");

    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }

    document.getElementById(id).style.display = "block";
}

/* =========================
   CLIENTES
========================= */

let clientes = [];

/* GUARDAR CLIENTE */

function guardarCliente() {

    let nombre = document.getElementById("nombreCliente").value;
    let cedula = document.getElementById("cedulaCliente").value;

    if (nombre == "" || cedula == "") {
        alert("Complete los datos");
        return;
    }

    let cliente = {
        nombre: nombre,
        cedula: cedula,
        telefono: document.getElementById("telefonoCliente").value,
        correo: document.getElementById("correoCliente").value
    };

    clientes.push(cliente);

    pintarClientes();
    limpiarClientes();
}

/* MODIFICAR CLIENTE */

function modificarCliente() {

    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for (let i = 0; i < clientes.length; i++) {

        if (clientes[i].cedula == cedulaBuscar) {

            clientes[i].nombre = document.getElementById("nombreCliente").value;
            clientes[i].telefono = document.getElementById("telefonoCliente").value;
            clientes[i].correo = document.getElementById("correoCliente").value;

            encontrado = true;
        }
    }

    if (encontrado) {
        pintarClientes();
        limpiarClientes();
        alert("Cliente modificado");
    } else {
        alert("Cliente no encontrado");
    }
}

/* BUSCAR CLIENTE */

function buscarCliente() {

    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for (let i = 0; i < clientes.length; i++) {

        if (clientes[i].cedula == cedulaBuscar) {

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

/* PINTAR CLIENTES */

function pintarClientes() {

    let contenido = "";

    for (let i = 0; i < clientes.length; i++) {

        contenido += `
        <tr>
            <td>${clientes[i].nombre}</td>
            <td>${clientes[i].cedula}</td>
            <td>${clientes[i].telefono}</td>
            <td>${clientes[i].correo}</td>
            <td>
                <button class="eliminar" onclick="eliminarCliente(${i})">X</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tablaClientes").innerHTML = contenido;
}

/* ELIMINAR CLIENTE */

function eliminarCliente(posicion) {
    clientes.splice(posicion, 1);
    pintarClientes();
}

/* LIMPIAR CLIENTES */

function limpiarClientes() {

    document.getElementById("nombreCliente").value = "";
    document.getElementById("cedulaCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("correoCliente").value = "";
}

/* =========================
   ABRIR CARD
========================= */

function abrirCard(titulo) {

    let card = titulo.closest(".cuadro");
    card.classList.toggle("activa");
}
function mostrarTodos() {
  pintarProductos(listaProductos);
}

function mostrarConIva() {
  let filtrados = listaProductos.filter(p => p.iva === true);
  pintarProductos(filtrados);
}

function mostrarSinIva() {
  let filtrados = listaProductos.filter(p => p.iva === false);
  pintarProductos(filtrados);
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
        </tr>
        `;
    }

    document.getElementById("tablaProductosLista").innerHTML = contenido;
}
let listaProductos = [
  { nombre: "Arroz", precio: 2.50, iva: true },
  { nombre: "Leche", precio: 1.20, iva: true },
  { nombre: "Pan", precio: 0.50, iva: false },
  { nombre: "Queso", precio: 3.00, iva: true },
  { nombre: "Agua", precio: 0.80, iva: false }
];
function agregarProductoLista() {

    let nombre = document.getElementById("nuevoProducto").value;
    let precio = parseFloat(document.getElementById("nuevoPrecio").value);
    let iva = document.getElementById("nuevoIva").value === "true";

    if (nombre === "" || isNaN(precio) || precio <= 0) {
        alert("Completa los datos correctamente");
        return;
    }

    listaProductos.push({
        nombre: nombre,
        precio: precio,
        iva: iva
    });

    pintarProductos(listaProductos);

    limpiarFormularioProductos();
}
function limpiarFormularioProductos() {

    document.getElementById("nuevoProducto").value = "";
    document.getElementById("nuevoPrecio").value = "";
    document.getElementById("nuevoIva").value = "true";
}