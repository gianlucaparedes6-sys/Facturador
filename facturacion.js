let productos = [];

function agregarProducto(){

    let producto =
    document.getElementById("producto").value;

    let cantidad =
    parseFloat(document.getElementById("cantidad").value);

    let precio =
    parseFloat(document.getElementById("precio").value);

    if(producto == "" || precio <= 0){

        alert("Complete los datos");

        return;
    }

    let subtotal = cantidad * precio;

    let item = {

        producto:producto,
        cantidad:cantidad,
        precio:precio,
        subtotal:subtotal

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

                <button
                class="eliminar"
                onclick="eliminarProducto(${i})">

                X

                </button>

            </td>

        </tr>

        `;

    }

    document.getElementById("tablaProductos").innerHTML =
    contenido;

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

    let ivaPorcentaje =
    parseFloat(document.getElementById("iva").value);

    let iva =
    subtotal * (ivaPorcentaje / 100);

    let total =
    subtotal + iva;

    document.getElementById("subtotal").innerHTML =
    "$ " + subtotal.toFixed(2);

    document.getElementById("valorIva").innerHTML =
    "$ " + iva.toFixed(2);

    document.getElementById("total").innerHTML =
    "$ " + total.toFixed(2);

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

    // OCULTAR TODAS

    document.getElementById("portada")
    .classList.add("oculto");

    document.getElementById("clientes")
    .classList.add("oculto");

    document.getElementById("facturacion")
    .classList.add("oculto");

    document.getElementById("productos")
    .classList.add("oculto");

    // MOSTRAR SECCIÓN

    document.getElementById(id)
    .classList.remove("oculto");

}
/* =========================
   VARIABLES CLIENTES
========================= */

let clientes = [];


/* =========================
   GUARDAR CLIENTES
========================= */

function guardarCliente(){

    let nombre =
    document.getElementById("nombreCliente").value;

    let cedula =
    document.getElementById("cedulaCliente").value;

    // VALIDACIONES

    if(nombre == "" || cedula == ""){

        alert("Complete los datos");

        return;
    }

    // CREAR OBJETO

    let telefono =
    document.getElementById("telefonoCliente").value;

    let correo =
    document.getElementById("correoCliente").value;

    let cliente = {

    nombre:nombre,
    cedula:cedula,
    telefono:telefono,
    correo:correo

};

    // GUARDAR EN ARREGLO

    clientes.push(cliente);

    // PINTAR TABLA

    pintarClientes();

    // LIMPIAR INPUTS

    limpiarClientes();

}
/* =========================
   MODIFICAR CLIENTE
========================= */

function modificarCliente(){

    let cedulaBuscar =
    document.getElementById("cedulaCliente").value;

    let encontrado = false;

    for(let i=0; i<clientes.length; i++){

        if(clientes[i].cedula == cedulaBuscar){

            clientes[i].nombre =
            document.getElementById("nombreCliente").value;

            clientes[i].telefono =
            document.getElementById("telefonoCliente").value;

            clientes[i].correo =
            document.getElementById("correoCliente").value;

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

                <button
                class="eliminar"
                onclick="eliminarCliente(${i})">

                    X

                </button>

            </td>

        </tr>

        `;

    }

    document.getElementById("tablaClientes")
    .innerHTML = contenido;

}
/* =========================
   ELIMINAR CLIENTE
========================= */

function eliminarCliente(posicion){

    // ELIMINA 1 ELEMENTO
    // EN LA POSICION INDICADA

    clientes.splice(posicion,1);

    // ACTUALIZA TABLA

    pintarClientes();

}


/* =========================
   LIMPIAR INPUTS
========================= */

function limpiarClientes(){

    document.getElementById("nombreCliente")
    .value = "";

    document.getElementById("cedulaCliente")
    .value = "";

}


/* =========================
   SOLO LETRAS
========================= */

function soloLetras(event){

    let tecla = event.key;

    let letras =
    "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ ";

    if(letras.indexOf(tecla) == -1){

        return false;

    }

}


/* =========================
   SOLO NUMEROS
========================= */

function soloNumeros(event){

    let tecla = event.key;

    let numeros = "0123456789";

    if(numeros.indexOf(tecla) == -1){

        return false;

    }

}