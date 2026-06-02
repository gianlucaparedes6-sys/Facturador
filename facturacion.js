let productos = [];

function agregarProducto(){
    let producto = document.getElementById("producto").value;
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let precio = parseFloat(document.getElementById("precio").value);

    if(producto == "" || precio <= 0){
        alert("Complete los datos");
        return;
    }

    let subtotal = cantidad * precio;
    let item = {
        producto: producto,
        shadow: cantidad,
        cantidad: cantidad,
        precio: precio,
        subtotal: subtotal
    };

    productos.push(item);
    pintarTabla();
    limpiarInputs();
}

function pintarTabla(){
    let contenido = "";
    for(let i=0; i<productos.length; i++){
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

function eliminarProducto(posicion){
    productos.splice(posicion,1);
    pintarTabla();
}

function calcularTotales(){
    let subtotal = 0;
    for(let i=0; i<productos.length; i++){
        subtotal += productos[i].subtotal;
    }

    let ivaPorcentaje = parseFloat(document.getElementById("iva").value);
    let iva = subtotal * (ivaPorcentaje / 100);
    let total = subtotal + iva;

    document.getElementById("subtotal").innerHTML = "$ " + subtotal.toFixed(2);
    document.getElementById("valorIva").innerHTML = "$ " + iva.toFixed(2);
    document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}

function limpiarInputs(){
    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("precio").value = "";
}

/* =========================
   MOSTRAR SECCIONES
========================= */
function mostrarSeccion(id){
    document.getElementById("portada").classList.add("oculto");
    document.getElementById("clientes").classList.add("oculto");
    document.getElementById("facturacion").classList.add("oculto");
    document.getElementById("productos").classList.add("oculto");

    document.getElementById(id).classList.remove("oculto");
}

/* =========================
   VARIABLES CLIENTES
========================= */
let clientes = [];

/* =========================
   GUARDAR CLIENTES
========================= */
function guardarCliente(){
    let nombre = document.getElementById("nombreCliente").value;
    let cedula = document.getElementById("cedulaCliente").value;

    if(nombre == "" || cedula == ""){
        alert("Complete los datos");
        return;
    }

    let telefono = document.getElementById("telefonoCliente").value;
    let correo = document.getElementById("correoCliente").value;

    let cliente = {
        nombre: nombre,
        cedula: cedula,
        telefono: telefono,
        correo: correo
    };

    clientes.push(cliente);
    pintarClientes();
    limpiarClientes();
}

/* =========================
   MODIFICAR CLIENTE
========================= */
function modificarCliente(){
    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for(let i=0; i<clientes.length; i++){
        if(clientes[i].cedula == cedulaBuscar){
            clientes[i].nombre = document.getElementById("nombreCliente").value;
            clientes[i].telefono = document.getElementById("telefonoCliente").value;
            clientes[i].correo = document.getElementById("correoCliente").value;
            encontrado = true;
        }
    }

    if(encontrado == true){
        pintarClientes();
        limpiarClientes();
        alert("Cliente modificado");
    }else{
        alert("Cliente no encontrado");
    }
}

/* =========================
   BUSCAR CLIENTE
========================= */
function buscarCliente(){
    let cedulaBuscar = document.getElementById("cedulaCliente").value;
    let encontrado = false;

    for(let i=0; i<clientes.length; i++){
        if(clientes[i].cedula == cedulaBuscar){
            document.getElementById("nombreCliente").value = clientes[i].nombre;
            document.getElementById("telefonoCliente").value = clientes[i].telefono;
            document.getElementById("correoCliente").value = clientes[i].correo;
            encontrado = true;
        }
    }

    if(encontrado == false){
        alert("Cliente no encontrado");
    }
}

/* =========================
   PINTAR CLIENTES
========================= */
function pintarClientes(){
    let contenido = "";
    for(let i=0; i<clientes.length; i++){
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

/* =========================
   ELIMINAR CLIENTE
========================= */
function eliminarCliente(posicion){
    clientes.splice(posicion,1);
    pintarClientes();
}

/* =========================
   LIMPIAR INPUTS CLIENTES
========================= */
function limpiarClientes(){
    document.getElementById("nombreCliente").value = "";
    document.getElementById("cedulaCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("correoCliente").value = "";
}

/* =========================
   PROCESAR PRODUCTOS PORTADA
========================= */
function guardarProductos() {
    let nomProd1 = document.getElementById("primerProducto").value;
    let precProd1 = parseFloat(document.getElementById("precioProducto").value) || 0;

    let nomProd2 = document.getElementById("segundoProducto").value;
    let precProd2 = parseFloat(document.getElementById("precioProducto2").value) || 0;

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

/* =========================
   CÁLCULO DE IVA PORTADA
========================= */
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
            <strong>Desarrollo:</strong> (${precioProd1.toFixed(2)} × ${porcentajeIva1}) ÷ 100 <br>
            <strong>Cálculo:</strong> ${precioProd1.toFixed(2)} × ${(porcentajeIva1 / 100).toFixed(4)} <br>
            <strong>Resultado IVA 1:</strong> <span style="color: #2563eb; font-weight: bold; font-size: 1.1em;">$ ${valorIva1.toFixed(2)}</span>
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
            <strong>Desarrollo:</strong> (${precioProd2.toFixed(2)} × ${porcentajeIva2}) ÷ 100 <br>
            <strong>Cálculo:</strong> ${precioProd2.toFixed(2)} × ${(porcentajeIva2 / 100).toFixed(4)} <br>
            <strong>Resultado IVA 2:</strong> <span style="color: #2563eb; font-weight: bold; font-size: 1.1em;">$ ${valorIva2.toFixed(2)}</span>
        </div>
    `;
}

/* ==============================================
   CÁLCULO TOTAL CON IVA INDIVIDUAL E IMPRESIÓN
================================================= */
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
        <div id="seccionImprimible" style="padding: 20px; border: 1px dashed #1f3c88; border-radius: 5px; background: #fafafa; margin-top: 15px;">
            <h3 style="text-align: center; color: #1f3c88; margin-bottom: 15px;">RESUMEN DE COBRO DETALLADO</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
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