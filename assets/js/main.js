// pre-entrega3
let carrito = [];
let productos = [];

let gestor;
const DateTime = luxon.DateTime;
const key_actualizacion = 'ultima_actualizacion';
const key_carrito = 'carrito';

const url = './assets/js/datos.json';

document.addEventListener('DOMContentLoaded', () => {
	carrito = JSON.parse(localStorage.getItem(key_carrito)) || [];

	let ingreso = localStorage.getItem(key_actualizacion);

	ingreso
		? console.log('Ultimo ingreso' + ingreso)
		: console.log('no esta registrado el ultimo ingreso');

	gestor = new GestionarProductos();
	gestor.iniciar();
});

function addCarrito(id) {
	const prod = document.querySelector('#row_' + id);
	let producto = new Producto(
		id,
		prod.querySelector('h3').textContent,
		prod.querySelector('.precio').textContent.substring(1, 6),
		prod.querySelector('img').src
	);

	gestor.addCart(producto);
}

function eliminar(id) {
	gestor.eliminarArticulo(id);
}

document.querySelector('#buscar').addEventListener('keyup', () => {
	let q = document.querySelector('#buscar').value;

	if (q.length >= 2) {
		gestor.mostrarHeader(`Resultados para: ${q}`);
		gestor.buscar(q);
	} else if (q.length === 0) {
		gestor.mostrarHeader('Todos los productos en stock');
		gestor.cargarProductos(productos);
	}
});
