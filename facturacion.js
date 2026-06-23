let ultimoProductoEliminado = null;
let productos = []; // Productos agregados a la factura actual

// PERSISTENCIA DE PRODUCTOS (CON / SIN IVA)
const productosPorDefecto = [
  { nombre: "Arroz", precio: 2.50, iva: true },
  { nombre: "Leche", precio: 1.20, iva: true },
  { nombre: "Pan", precio: 0.50, iva: false },
  { nombre: "Queso", precio: 3.00, iva: true },
  { nombre: "Agua", precio: 0.80, iva: false }
];

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

    let existe = listaProductos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        alert("Este producto ya está registrado.");
        return;
    }

    listaProductos.push({ nombre, precio, iva });
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

function mostrarSeccion(id) {
    let secciones = document.getElementsByClassName("seccion");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}

// VALIDACIONES ECUADOR Y FORMATOS
function validarNombreApellido(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}(?:\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})*$/;
    return regex.test(nombre.trim());
}

function validarCedulaEcuador(cedula) {
    cedula = cedula.trim();
    if (cedula.length !== 10 || isNaN(cedula)) return false;
    const provincia = parseInt(cedula.substring(0, 2), 10);
    const tercerDigito = parseInt(cedula.charAt(2), 10);
    if ((provincia < 1 || provincia > 24) && provincia !== 30) return false;
    if (tercerDigito >= 6) return false;

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < coeficientes.length; i++) {
        let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
        if (valor >= 10) valor -= 9; 
        suma += valor;
    }
    const verificadorCalculado = (suma % 10 === 0) ? 0 : 10 - (suma % 10);
    return verificadorCalculado === parseInt(cedula.charAt(9), 10);
}

function validarTelefonoEcuador(telefono) {
    const regex = /^(09\d{8}|0[2-7]\d{7})$/;
    return regex.test(telefono.trim());
}

function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo.trim());
}

function validarCamposCliente(nombre, cedula, telefono, correo) {
    if (!validarNombreApellido(nombre)) { alert("Nombre y Apellido inválidos."); return false; }
    if (!validarCedulaEcuador(cedula)) { alert("Cédula de Ecuador inválida."); return false; }
    if (!validarTelefonoEcuador(telefono)) { alert("Teléfono inválido."); return false; }
    if (!validarCorreo(correo)) { alert("Correo inválido."); return false; }
    return true;
}

// CLIENTES
let clientes = JSON.parse(localStorage.getItem("clientes_sistema")) || [];

function guardarCliente() {
    let nombre = document.getElementById("nombreCliente").value;
    let cedula = document.getElementById("cedulaCliente").value;
    let telefono = document.getElementById("telefonoCliente").value;
    let correo = document.getElementById("correoCliente").value;

    if (!validarCamposCliente(nombre, cedula, telefono, correo)) return; 

    if (clientes.some(c => c.cedula === cedula.trim())) {
        alert("Esta cédula ya está registrada.");
        return;
    }

    clientes.push({ nombre: nombre.trim(), cedula: cedula.trim(), telefono: telefono.trim(), correo: correo.trim() });
    localStorage.setItem("clientes_sistema", JSON.stringify(clientes));
    pintarClientes();
    limpiarClientes();
    alert("Cliente guardado.");
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
    if (!encontrado) alert("Cliente no encontrado");
}

function modificarCliente() {
    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let nombre = document.getElementById("nombreCliente").value;
    let telefono = document.getElementById("telefonoCliente").value;
    let correo = document.getElementById("correoCliente").value;
    let encontrado = false;

    if (!validarCamposCliente(nombre, cedulaBuscar, telefono, correo)) return;

    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedulaBuscar) {
            clientes[i].nombre = nombre.trim();
            clientes[i].telefono = telefono.trim();
            clientes[i].correo = correo.trim();
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
        contenido += `<tr><td>${clientes[i].nombre}</td><td>${clientes[i].cedula}</td><td>${clientes[i].telefono}</td><td>${clientes[i].correo}</td><td><button onclick="eliminarCliente(${i})">X</button></td></tr>`;
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
    if (cedulaBuscar === "") { alert("Ingrese una cédula."); return; }
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedulaBuscar) {
            document.getElementById("cliente").value = clientes[i].nombre;
            document.getElementById("telefono").value = clientes[i].telefono;
            document.getElementById("correo").value = clientes[i].correo;
            encontrado = true;
            break; 
        }
    }
    if (!encontrado) alert("Cliente no registrado. Puede ingresarlo manualmente.");
}

// PORTADA MANUAL
function guardarProductos() {
    let nomProd1 = document.getElementById("primerProducto").value;
    let precProd1 = Math.abs(parseFloat(document.getElementById("precioProducto").value) || 0);
    let nomProd2 = document.getElementById("segundoProducto").value;
    let precProd2 = Math.abs(parseFloat(document.getElementById("precioProducto2").value) || 0);

    if (nomProd1 === "" || nomProd2 === "" || precProd1 <= 0 || precProd2 <= 0) {
        alert("Complete nombres y precios.");
        return;
    }
    let sumaSubtotal = precProd1 + precProd2;
    document.getElementById("resultadoPortada").innerHTML = `
        <div class="card" style="border: 2px solid #2563eb;">
            <h2>Resumen de Productos</h2>
            <p><strong>Producto 1:</strong> ${nomProd1} — $ ${precProd1.toFixed(2)}</p>
            <p><strong>Producto 2:</strong> ${nomProd2} — $ ${precProd2.toFixed(2)}</p>
            <div style="border-top: 1px solid #ddd; padding-top: 10px;"><h3>Suma Total: $ ${sumaSubtotal.toFixed(2)}</h3></div>
        </div>`;
}

function proIVA1() {
    let precioProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;
    let porcentajeIva1 = parseFloat(document.getElementById("porcentajeDeIVA1").value) || 0;
    if (precioProd1 <= 0) { alert("Ingrese el precio."); return; }
    document.getElementById("resultadoIVA1").innerHTML = `<div>Resultado IVA 1: $ ${(precioProd1 * porcentajeIva1 / 100).toFixed(2)}</div>`;
}

function proIVA2() {
    let precioProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;
    let porcentajeIva2 = parseFloat(document.getElementById("porcentajeDeIVA2").value) || 0;
    if (precioProd2 <= 0) { alert("Ingrese el precio."); return; }
    document.getElementById("resultadoIVA2").innerHTML = `<div>Resultado IVA 2: $ ${(precioProd2 * porcentajeIva2 / 100).toFixed(2)}</div>`;
}

function total() {
    let nomProd1 = document.getElementById("primerProducto").value || "Producto 1";
    let precProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;
    let nomProd2 = document.getElementById("segundoProducto").value || "Producto 2";
    let precProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;
    let porcIva1 = parseFloat(document.getElementById("porcentajeDeIVA1").value) || 0;
    let porcIva2 = parseFloat(document.getElementById("porcentajeDeIVA2").value) || 0;

    if (precProd1 <= 0 && precProd2 <= 0) return;

    let iv1 = (precProd1 * porcIva1) / 100;
    let iv2 = (precProd2 * porcIva2) / 100;

    document.getElementById("facturaFinalPortadas").innerHTML = `
        <div id="seccionImprimible" style="padding: 20px; background: #fafafa; color: #000;">
            <h3>RESUMEN DE COBRO</h3>
            <p>${nomProd1}: $ ${(precProd1 + iv1).toFixed(2)}</p>
            <p>${nomProd2}: $ ${(precProd2 + iv2).toFixed(2)}</p>
            <hr>
            <strong>TOTAL NETO: $ ${(precProd1 + iv1 + precProd2 + iv2).toFixed(2)}</strong>
        </div>`;
}

function imprimirPDF() {
    if (document.getElementById("facturaFinalPortadas").innerHTML.trim() === "") return;
    window.print();
}

// TEMA CLARO / OSCURO
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
    if (temaGuardado === "claro") {
        document.body.classList.add("light-theme");
        setTimeout(() => { if(document.getElementById("btn-tema")) document.getElementById("btn-tema").innerHTML = "☀️ Modo Claro"; }, 50);
    }
})();

// ==========================================================================
// CONTABILIDAD, GUARDADO Y CONTROL DE GANANCIAS
// ==========================================================================
let historialContable = JSON.parse(localStorage.getItem("historial_contabilidad")) || [];

function guardarYLimpiarFactura() {
    let inputCliente = document.getElementById("cliente").value.trim();
    let inputCedula = document.getElementById("cedula").value.trim();

    if (productos.length === 0) {
        alert("No se puede guardar una factura sin productos.");
        return;
    }
    if (inputCliente === "" || inputCedula === "") {
        alert("Complete el Nombre y Cédula del cliente antes de guardar.");
        return;
    }

    let totalFactura = 0;
    for (let i = 0; i < productos.length; i++) {
        totalFactura += productos[i].subtotal;
    }

    let listadoProductosTexto = productos.map(p => `${p.producto} (x${p.cantidad})`).join(", ");

    historialContable.push({
        cliente: inputCliente,
        cedula: inputCedula,
        productos: listadoProductosTexto,
        total: totalFactura
    });

    localStorage.setItem("historial_contabilidad", JSON.stringify(historialContable));
    pintarHistorialContable();

    // LIMPIEZA COMPLETA DE CAMPOS
    productos = [];
    pintarTabla();
    
    document.getElementById("cedula").value = "";
    document.getElementById("cliente").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    limpiarInputs();

    alert("Factura guardada. Campos reiniciados para una nueva facturación.");
}

function pintarHistorialContable() {
    let contenido = "";
    let acumuladorGanancias = 0;

    for (let i = 0; i < historialContable.length; i++) {
        acumuladorGanancias += historialContable[i].total;
        contenido += `
        <tr>
            <td>${historialContable[i].cliente}</td>
            <td>${historialContable[i].cedula}</td>
            <td>${historialContable[i].productos}</td>
            <td>$ ${historialContable[i].total.toFixed(2)}</td>
        </tr>
        `;
    }

    let tabla = document.getElementById("tablaHistorialContable");
    if (tabla) {
        tabla.innerHTML = contenido === "" ? "<tr><td colspan='4'>No hay facturas registradas.</td></tr>" : contenido;
    }
    let etiquetaTotal = document.getElementById("totalGananciasAcumuladas");
    if (etiquetaTotal) {
        etiquetaTotal.innerHTML = "$ " + acumuladorGanancias.toFixed(2);
    }
}

function vaciarHistorialContable() {
    if (confirm("¿Desea eliminar todo el historial contable?")) {
        historialContable = [];
        localStorage.removeItem("historial_contabilidad");
        pintarHistorialContable();
    }
}

function exportarContabilidadExcel() {
    if (historialContable.length === 0) return;
    let plantillaExcel = `<meta charset="utf-8"><table border="1"><tr style="background: #21262d; color: #58a6ff; font-weight: bold;"><th>Cliente</th><th>Cédula / RUC</th><th>Productos Agregados</th><th>Total Facturado ($)</th></tr>`;
    for (let i = 0; i < historialContable.length; i++) {
        plantillaExcel += `<tr><td>${historialContable[i].cliente}</td><td>${historialContable[i].cedula}</td><td>${historialContable[i].productos}</td><td>${historialContable[i].total.toFixed(2)}</td></tr>`;
    }
    plantillaExcel += "</table>";

    let blob = new Blob([plantillaExcel], { type: "application/vnd.ms-excel" });
    let urlDescarga = URL.createObjectURL(blob);
    let tagEnlace = document.createElement("a");
    tagEnlace.href = urlDescarga;
    tagEnlace.download = "Reporte_Contabilidad_Ganancias.xls";
    document.body.appendChild(tagEnlace);
    tagEnlace.click();
    document.body.removeChild(tagEnlace);
}

// ==========================================================================
// NUEVA FUNCIÓN: IMPRESIÓN EN PDF DE LA FACTURA ACTUAL PARA EL CLIENTE
// ==========================================================================
function imprimirFacturaClientePDF() {
    if (productos.length === 0) {
        alert("No hay productos en la tabla para generar una factura.");
        return;
    }

    let txtCedula = document.getElementById("cedula").value.trim() || "Consumidor Final";
    let txtCliente = document.getElementById("cliente").value.trim() || "S/N";
    let txtTelefono = document.getElementById("telefono").value.trim() || "S/N";
    let txtCorreo = document.getElementById("correo").value.trim() || "S/N";

    let valSubtotal = document.getElementById("subtotal").innerHTML;
    let valIva = document.getElementById("valorIva").innerHTML;
    let valTotal = document.getElementById("total").innerHTML;

    let filasProductosHtml = "";
    for (let i = 0; i < productos.length; i++) {
        filasProductosHtml += `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${productos[i].producto}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${productos[i].cantidad}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$ ${productos[i].precio.toFixed(2)}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$ ${productos[i].subtotal.toFixed(2)}</td>
        </tr>
        `;
    }

    let ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(`
    <html>
    <head>
        <title>Factura - ${txtCliente}</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; margin: 0; background-color: #fff; }
            .factura-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 8px; }
            .encabezado { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1f3c88; padding-bottom: 20px; margin-bottom: 20px; }
            .logo-seccion h2 { color: #1f3c88; margin: 0; font-size: 28px; text-transform: uppercase; }
            .info-factura { text-align: right; font-size: 14px; line-height: 1.5; }
            .datos-cliente { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #1f3c88; }
            .datos-cliente h4 { margin: 0 0 10px 0; color: #1f3c88; text-transform: uppercase; }
            .grid-datos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #1f3c88; color: white; padding: 10px; font-size: 14px; }
            .seccion-totales { width: 300px; margin-left: auto; font-size: 15px; line-height: 2; }
            .fila-total { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
            .total-final { border-top: 2px solid #1f3c88; font-weight: bold; font-size: 18px; color: #1f3c88; }
            .pie { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="factura-box">
            <div class="encabezado">
                <div class="logo-seccion">
                    <h2>COREFACT S.A.</h2>
                    <p>Sistemas Inteligentes de Facturación</p>
                </div>
                <div class="info-factura">
                    <strong>RUC:</strong> 1792456789001<br>
                    <strong>Factura Nro:</strong> AUT-${Math.floor(100000 + Math.random() * 900000)}<br>
                    <strong>Fecha:</strong> ${new Date().toLocaleDateString()}<br>
                </div>
            </div>
            <div class="datos-cliente">
                <h4>Información del Cliente</h4>
                <div class="grid-datos">
                    <div><strong>Nombre:</strong> ${txtCliente}</div>
                    <div><strong>Cédula / RUC:</strong> ${txtCedula}</div>
                    <div><strong>Teléfono:</strong> ${txtTelefono}</div>
                    <div><strong>Correo:</strong> ${txtCorreo}</div>
                </div>
            </div>
            <table>
                <thead>
                    <tr><th>Descripción</th><th>Cantidad</th><th>P. Unitario</th><th>Total</th></tr>
                </thead>
                <tbody>${filasProductosHtml}</tbody>
            </table>
            <div class="seccion-totales">
                <div class="fila-total"><span>Subtotal Base:</span><span>${valSubtotal}</span></div>
                <div class="fila-total"><span>IVA Desglosado:</span><span>${valIva}</span></div>
                <div class="fila-total total-final"><span>TOTAL A PAGAR:</span><span>${valTotal}</span></div>
            </div>
            <div class="pie"><p>Documento sin valor tributario legal - Ambiente de Desarrollo.</p></div>
        </div>
    </body>
    </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    setTimeout(() => {
        ventanaImpresion.print();
        ventanaImpresion.close();
    }, 350);
}

// INICIALIZACIÓN DEL SISTEMA
pintarClientes();
pintarProductos(listaProductos);
asignarAutocompletadoFactura();
pintarHistorialContable();