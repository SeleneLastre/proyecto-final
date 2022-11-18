class GestionarProductos {
	iniciar() {
		fetch(url)
			.then(respuesta => respuesta.json())
			.then(resultado => {
				console.log(resultado);
				productos = resultado.productos;

				let productosDestacados = productos.filter(prod => prod.destacado == 1);

				this.cargarProductos(productosDestacados);
			});

		/*
        productos = [

            {
                "id": 1,
                "nombre": "Black Hoodie",
                "descripcion": "hoodie de frisa para invierno",
                "precio": 7500,
                "stock": 10,
                "img": "blackhoode.JPG",
                "destacado": 1
            },

            {
                "id": 2,
                "nombre": "Manguitas",
                "descripcion": "tejidas a mano por nosotros",
                "precio": 6000,
                "stock": 20,
                "img": "manguitas.JPG",
                "destacado": 1
            },
            {
                "id": 3,
                "nombre": "Buzo Retro Beige",
                "descripcion": "Buzo inspirado en los 90, Hecho de tela rustica ideal para el verano, sus mangas son 3/4.",
                "precio": 6000,
                "stock": 2,
                "img": "retrobeige.JPG",
                "destacado": 1
            },

            {
                "id": 4,
                "nombre": "Ice Hoodie",
                "descripcion": "Frisa Rustica, ideal para el verano.",
                "precio": 7500,
                "stock": 2,
                "img": "icehoodie.JPG",
                "destacado": 1
            },
            {
                "id": 5,
                "nombre": "Buzo Retro Cuello Tortuga",
                "descripcion": "frisa de invierno",
                "precio": 6500,
                "stock": 0,
                "img": "retrocuellot.JPG",
                "destacado": 1
            }
        ]*/

		let productosDestacados = productos.filter(prod => prod.destacado == 1);

		this.cargarProductos(productosDestacados);

		this.mostrarCarrito();

		this.actualizarContador();
	}

	cargarProductos(productos) {
		const divProductos = document.querySelector('#productos');
		divProductos.innerHTML = '';

		if (productos.length === 0) {
			this.mostrarHeader('Productos:');
			return false;
		} else {
			productos.forEach(producto => {
				const {
					id: id_prod,
					nombre: nombre_prod,
					precio: precio_prod,
					img: img_prod,
					cantidad: cant_prod,
					descripcion: descripcion_prod,
				} = producto;

				let prod = document.createElement('div');
				prod.classList.add(
					'col-12',
					'h200',
					'border',
					'bg-white',
					'rounded',
					'mt-3',
					'd-flex',
					'align-items-center',
					'p-3',
					'flex-row',
					'producto'
				);
				prod.setAttribute('id', 'row_' + id_prod);

				prod.innerHTML = `      <div class="w-20">
                                            <img src="./assets/img/${img_prod}" alt="" width="150" height="150" >
                                        </div>
    
                                        <div class="p-3 d-flex flex-column w-60 h-150">
                                            <h3>${nombre_prod}</h3>                                            
                                            <p>${descripcion_prod.substring(0, 120)}</p>
                                        </div>
    
                                        <div class="d-flex align-items-center justify-content-center flex-column w-20 h-150">
                                            <p class="precio">$${precio_prod}</p>
                                            <a href="javascript:addCarrito(${id_prod})" class="btn btn-primary">Agregar al carrito</a>
                                        </div>`;

				divProductos.appendChild(prod);
			});
		}
	}

	buscar(q) {
		let resultado = productos.filter(
			producto =>
				producto.nombre.toLowerCase().includes(q.toLowerCase()) ||
				producto.descripcion.toLowerCase().includes(q.toLowerCase())
		);
		this.cargarProductos(resultado);
	}

	addCart(infoProducto) {
		const existe = carrito.some(producto => producto.id === infoProducto.id);

		if (existe) {
			const articulos = carrito.map(producto => {
				if (producto.id === infoProducto.id) {
					producto.cantidad++;
					return producto;
				} else {
					return producto;
				}

				carrito = articulos;
			});

			this.mostrar_notificacion('se actualizo la cantidad del producto', 2000, 'bottom');
		} else {
			carrito.push(infoProducto);

			this.mostrar_notificacion('se agrego el producto con éxito', 3000, 'bottom');
		}

		this.actualizarCarrito();
	}

	contarProductos() {
		let contadorProductos = 0;

		carrito.forEach(producto => {
			contadorProductos = contadorProductos + parseInt(producto.cantidad);
		});

		return contadorProductos;
	}

	actualizarCarrito() {
		this.actualizarContador();

		this.mostrarCarrito();

		this.guardarCarrito();
	}

	actualizarContador() {
		let totalArticulos = this.contarProductos();

		let countCarrito = document.querySelector('#badgeCarrito');

		countCarrito.innerHTML = totalArticulos;
	}

	mostrarCarrito() {
		let detalleCarrito = document.querySelector('#idCarrito');

		detalleCarrito.innerHTML = '';

		let total = 0;

		carrito.forEach(producto => {
			const { id, nombre, precio, img, cantidad } = producto;

			const row = document.createElement('div');
			row.classList.add('row');

			total += parseInt(precio);

			row.innerHTML = `
                
                        <div class="col-3 d-flex align-items-center p-2 border-bottom">
                            <img src="${img}" width="80"/>
                        </div>

                        <div class="col-3 d-flex align-items-center p-2 border-bottom">
                            ${nombre}
                        </div>

                        <div class="col-3 d-flex align-items-center justify-content-end p-2 border-bottom">
                            $ ${precio}
                        </div>

                        <div class="col-1 d-flex align-items-center justify-content-end p-2 border-bottom">
                            ${cantidad}
                        </div>

                        <div class="col-2 d-flex align-items-center justify-content-center p-2 border-bottom">
                            <a href="javascript:eliminar(${id})">
                                <i class="fa-solid fa-square-minus fa-2x"></i>
                            </a>
                        </div>
            `;

			detalleCarrito.appendChild(row);
		});

		let row = document.createElement('div');
		row.classList.add('row');

		row.innerHTML = `   <div class="col-4 d-flex align-items-center justify-content-start p-2 border-bottom">
                                Total a pagar:
                            </div>
                            <div class="col-8 d-flex align-items-center justify-content-end p-2 border-bottom">
                                <b> $ ${total}</b>
                            </div>`;

		detalleCarrito.appendChild(row);
	}

	eliminarArticulo(id) {
		Swal.fire({
			title: '"Esta seguro de eliminar el producto ?"',
			showCancelButton: true,
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminarlo',
			cancelButtonText: `Cancelar, toque sin querer!`,
		}).then(result => {
			if (result.isConfirmed) {
				carrito = carrito.filter(articulo => articulo.id != id);
				this.actualizarCarrito();

				this.mostrar_notificacion('el articulo fue eliminado del carrito', 2000, 'bottom');
			}
		});
	}

	guardarCarrito() {
		localStorage.setItem(key_carrito, JSON.stringify(carrito));
		const dt = DateTime.now();
		let date = dt.toLocaleString();
		localStorage.setItem(key_actualizacion, date);
	}

	mostrarHeader(msg) {
		const headerProductos = document.querySelector('#headerProductos');
		headerProductos.innerHTML = msg;
	}

	mostrar_notificacion(texto, duracion, posicion) {
		Toastify({
			text: texto,
			duration: duracion,
			gravity: posicion,
		}).showToast();
	}
}
