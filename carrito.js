//      PRODUCTOS
// DECLARACIÓN DE CLASE
class Productos{
    constructor (id, titulo, precio, stock, img){
        this.id = id
        this.titulo = titulo
        this.precio = precio
        this.stock = stock
        this.img = img
    }
};

// ARRAY DE PRODUCTOS
let listaDeProductos = []
//DESDE productos.json
fetch('./productos.json')
.then(response => response.json())
.then(data => {
    for(let producto of data){
        let nuevoProducto = new Productos(producto.id, producto.titulo, producto.precio, producto.stock, producto.img);
        listaDeProductos.push(nuevoProducto);
    };
    mostrarCards();
});

//CAPTURA DE ELEMENTOS DOM
let carritotbtn = document.getElementById("carritotbtn");
let plantillaDelCarrito = document.getElementById("plantillaDelCarrito");
let totalCarrito = document.getElementById("totalCarrito");
let acumulador;
let divDeCards = document.getElementById("plantilla");
let borrarbtn2 = document.getElementsByClassName("borrarbtn2");
let comprarBtn = document.getElementById("comprarBtn");

//CREAR CARDS DE PRODUCTOS
function mostrarCards(){
    listaDeProductos.forEach((producto)=>{
        let nuevoProducto = document.createElement("div");
        nuevoProducto.innerHTML = `<article id="${producto.id}" class="card">
                                        <h1 class="card__title">${producto.titulo}</h1>
                                        <img src="${producto.img}" alt="${producto.titulo}" class="card__pics">
                                        <div class="card__section">
                                            <p class="card__text">Precio: $${producto.precio}</p>
                                            <button id="agregarBtn${producto.id}" class="card__btn btn">Agregar al carrito</button>
                                        </div>
                                    </article>`;
        divDeCards.appendChild(nuevoProducto);
        //GUARDAR EN LOCAL
        localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos))
        // BTN PARA AGREGAR AL CARRITO
        let btnAgregar = document.getElementById(`agregarBtn${producto.id}`)
        //EVENTO PARA QUE EL BOTON AÑADA AL CARRITO
        btnAgregar.addEventListener("click", () => {aniadirAlCarrito(producto)})
    });
}

//  CARRITO
// ARRAY DE CARRITO
let carritoDeCompras = JSON.parse(localStorage.getItem("carritoDeCompras")) || [];

// //FUNCIÓN PARA AÑADIR AL CARRITO
function aniadirAlCarrito(producto){
    let productoAgregado = carritoDeCompras.find((e) => (e.id == producto.id));
    if (productoAgregado == undefined){
        carritoDeCompras.push(producto);
        localStorage.setItem("carritoDeCompras", JSON.stringify(carritoDeCompras));
        Swal.fire({
            icon: "success",
            text: `Agregaste ${producto.titulo} a tu carrito~`,
            confirmButtonText: 'Ok',
            buttonsStyling: false,
            background: '#658582' ,
            width: '20em',
            color: '#090302' ,
        })
    }else{
        Swal.fire({
            icon: "warning",
            text: `Ya agregaste ${producto.titulo} a tu carrito~`,
            confirmButtonText: 'Ok',
            buttonsStyling: false,
            background: '#658582' ,
            width: '20em',
            color: '#090302' ,
        })
    }
}

//TOTAL DE LAS COMPRAS
function total(){    
    acumulador = 0;
    totalCarrito.innerHTML = " "
    carritoDeCompras.forEach((producto) => {
        acumulador += producto.precio
    })
    totalCarrito.innerHTML = `<div class="offcanvas-body" id="totalCarrito">
                                    <p>El total de tu compra es de $${acumulador}</p>
                                    
                                </div>`
    localStorage.setItem("carritoDeCompras", JSON.stringify(carritoDeCompras));
};

//CARGAR COMPRAS AL OFFCANVAS
async function cargandoElCarritoDeCompras(){
    plantillaDelCarrito.innerHTML = " " ;
    carritoDeCompras.forEach((producto, id) => {
        const plantilla = document.createElement('div')
        plantilla.innerHTML += `<div id="${producto.id}" class="card2">
                                                <div>
                                                    <h1 class="card__titulo">${producto.titulo}</h1>
                                                    <p class="card__precio">Precio: $${producto.precio}</p>
                                                    <button class="btn btn-secondary borrarbtn2" type="button" id="eliminarbtn${producto.id}"><img src="./media/bx-trash.svg" alt="Borrar producto del carrito"></button>
                                                </div>
                                                <div>
                                                    <img src="${producto.img}" alt="${producto.titulo}" class="card__pics2">
                                                </div>
                                            </div>` ;
        plantillaDelCarrito.appendChild(plantilla);
        //Boton para borrar con alert
        document.getElementById(`eliminarbtn${producto.id}`).addEventListener('click', () =>{
            Swal.fire({
                icon: "warning",
                text: `Eliminaste ${producto.titulo} de tu carrito~`,
                confirmButtonText: 'Entendido',
                buttonsStyling: false,
                background: '#658582' ,
                width: '20em',
                color: '#090302' ,
            });
            //Eliminar del dom
            // let tarjeta = document.getElementById(`${producto.id}`);
            plantillaDelCarrito.removeChild(plantilla);
            //Eliminar del carrito
            carritoDeCompras.splice(id, 1);
            localStorage.setItem("carritoDeCompras", JSON.stringify(carritoDeCompras));
            total(carritoDeCompras);
            })
        });
    total(carritoDeCompras);
};
cargandoElCarritoDeCompras();

//FUNCION COMPRAR
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

function comprar(){
    swalWithBootstrapButtons.fire({
        title: '¿Todo listo?',
        text: "¿Querès finalizar tu compra?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, comprar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        background: '#658582' ,
        color: '#090302' ,
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Listo! Compra exitosa!',
                'Su compra se realizò correctamente~',
                'success'
            );
            carritoDeCompras = [];
            localStorage.removeItem('carritoDeCompras');
            // Probando
            console.log(`El total de la compra es de ${acumulador}`);
            cargandoElCarritoDeCompras(carritoDeCompras);
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Compra cancelada',
                'Su compra se ha cancelado correctamente~',
                'error'
            )
        }
    })
}

//EVENTO QUE MUESTRA EL OFFCANVAS
carritotbtn.addEventListener('click', ()=>{cargandoElCarritoDeCompras()});

//EVENTO PARA COMPRAR Y TERMINAR
comprarBtn.addEventListener('click', ()=>{comprar()});