const URL = "https://www.etnassoft.com/api/v1/get";
let limite = 10;
let totalPaginas = 0;
const ulTag = document.getElementById("ulPagination");
let lastGet = "";

function cambiarLimite(event) {
	limite = Number(event.target.value);
}

function cargarProductos(productos) {
	localStorage.setItem("productos", JSON.stringify(productos));
}

function borrarProductosVista() {
	document.getElementById("section-product").innerHTML = "";
}

function cargarAlHistorial(producto) {
	let productosHistorial = JSON.parse(localStorage.getItem("historial") || "[]");

	const exist = productosHistorial.some((p) => p.ID === producto.ID);
	if (!exist) {
		productosHistorial.push(producto);
		localStorage.setItem("historial", JSON.stringify(productosHistorial));
	}
}

function getCustomParams(params) {
	borrarProductosVista();
	let customUrl = "";
	params.forEach((p) => (customUrl += `${p.key}=${p.value}&`));
	// se remueve el último & concatenado en el forEach
	customUrl = customUrl.slice(0, -1);

	//contar cantidad para paginacion
	$.getJSON(`${URL}/?${customUrl}&count_items=true`, (num) => {
		totalPaginas = Math.ceil(num?.num_items / limite);
		if (totalPaginas > 1) {
			cargarPaginacion(totalPaginas, 1);
		} else {
			ulTag.innerHTML = "";
		}
	});

	//obtener libros por filtro
	$.getJSON(`${URL}/?${customUrl}`, (results) => {
		lastGet = customUrl;
		cargarProductos(results);
		results.forEach((product) => {
			crearProduct(product);
		});
	});
}

function cargarPaginacion(totalPaginas, page) {
	let liTag = "";
	let beforePages = page - 1;
	let afterPages = page + 1;
	if (page > 1) {
		liTag += `<li class="btn-pag prev" onclick="cargarPaginacion(totalPaginas, ${
			page - 1
		});getWithPagination(${page - 1})">
					<span><i class="fas fa-angle-left"></i></span>
				</li>`;
	}

	if (page > 2) {
		liTag += `<li class="numb" onclick="cargarPaginacion(totalPaginas, 1);getWithPagination(1)"><span>1</span></li>`;
		if (page > 3) {
			liTag += `<li class="dots"><span>...</span></li>`;
		}
	}

	if (page === 1) {
		afterPages = afterPages + 2;
	} else if (page === 2) {
		afterPages = afterPages + 1;
	}

	if (page === totalPaginas) {
		beforePages = beforePages - 2;
	} else if (page === totalPaginas - 1) {
		beforePages = beforePages - 1;
	}

	for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
		if (pageLength >= totalPaginas) {
			continue;
		}
		if (pageLength === 0) {
			pageLength = pageLength + 1;
		}

		liTag += `<li class="numb ${
			page === pageLength ? "active" : ""
		}" onclick="cargarPaginacion(totalPaginas, ${pageLength});getWithPagination(${pageLength})"><span>${pageLength}</span></li>`;
	}

	if (page < totalPaginas - 2) {
		if (page < totalPaginas - 3) {
			liTag += `<li class="dots"><span>...</span></li>`;
		}
		liTag += `<li class="numb" onclick="cargarPaginacion(totalPaginas, ${
			totalPaginas - 1
		});getWithPagination(${totalPaginas - 1})"><span>${totalPaginas - 1}</span></li>`;
	}

	if (page < totalPaginas - 1) {
		liTag += `<li class="btn-pag next" onclick="cargarPaginacion(totalPaginas, ${
			page + 1
		});getWithPagination(${page + 1})">
                    <span><i class="fas fa-angle-right"></i></span>
                </li>`;
	}
	ulTag.innerHTML = liTag;
}

function getWithPagination(numPagina) {
	borrarProductosVista();
	customUrl = lastGet + `&results_range=${numPagina * limite},${limite}`;
	$.getJSON(`${URL}/?${customUrl}`, (results) => {
		cargarProductos(results);
		results.forEach((product) => {
			crearProduct(product);
		});
	});
}

function crearProduct(product) {
	let tituloRecortado = product.title.slice(0, 74);
	let carrito = JSON.parse(localStorage.getItem("carrito"));

	if (product.ID in carrito) {
		btn = `<button class='btn-del font-roboto text-white' data-id='${product.ID}' data-price='${product.pages}'>Eliminardel carrito</button>`;
	} else {
		btn = `<button class='btn-add font-roboto text-white' data-id='${product.ID}' data-price='${product.pages}'>Agregar al carrito</button>`;
	}

	$(`<div class='container-product flex-column space-between box-shadow align-center'>
  <div class='container-image-product'>
      <img class='product' src='${product.thumbnail}' alt='producto'>
  </div>
  <div class="detail-info-book flex-column space-between">
    <h2 class='detail-product font-roboto text-blue'>Título del Libro: ${tituloRecortado}</h2>
    <h2 class='detail-product font-roboto text-blue'>Autor: ${product.author}</h2>
    <h2 class='detail-product font-roboto text-blue'>Precio: $ ${product.pages}</h2>
  </div>
  <div class='view-more flex-row space-around align-center'>
      <h2 class='more-info'><button class='share align-center text-blue' onclick='cargarProducto("/share.html","${product.ID}")'>Compartir</button></h2>
      <span>|</span>
      <h2 class='container-view'><button class='view align-center' onclick='cargarProducto("/product.html","${product.ID}")'>Ver +</button></h2>
  </div>
	${btn}
	</div>`).appendTo(document.getElementById("section-product"));
	// Bindeo evento del click agregar a carrito
	createEvents();
}

async function buscarLibroPorId(id) {
	return await $.getJSON(`${URL}/?id=${id}`);
}

function cargarProducto(destino, idProducto) {
	let productos = JSON.parse(localStorage.getItem("productos"));
	let producto = JSON.parse(localStorage.getItem("producto"));
	if (!(producto.ID === idProducto)) {
		producto = productos.filter((p) => p.ID === idProducto)[0];
	}
	if (producto) {
		localStorage.setItem("producto", JSON.stringify(producto));
		saltoPagina(destino);
		return;
	} else {
		buscarLibroPorId(idProducto).then((restuls) => {
			localStorage.setItem("producto", JSON.stringify(restuls[0]));
			saltoPagina(destino);
			return;
		});
	}
	return;
}

function saltoPagina(destino) {
	if (location.origin.startsWith("https")) {
		location.href = location.origin + "/appMoviles" + destino;
	} else {
		location.href = location.origin + destino;
	}
	return;
}

function cargarProductoDetalle() {
	let carrito = JSON.parse(localStorage.getItem("carrito"));

	const producto = JSON.parse(localStorage.getItem("producto"));
	let categorias = [];
	producto.categories.forEach((category) => categorias.push(category.name));

	if (producto.ID in carrito) {
		btn = `<button class='btn-del font-roboto text-white' data-id='${producto.ID}' data-price='${producto.pages}'>Eliminardel carrito</button>`;
	} else {
		btn = `<button class='btn-add font-roboto text-white' data-id='${producto.ID}' data-price='${producto.pages}'>Agregar al carrito</button>`;
	}
	cargarAlHistorial(producto);

	categorias = categorias.join(" - ");
	$(`<div class="container-photo-book align-center">
    <img class="photo-book" src=${producto.cover} alt="producto">
  </div>
  <div class="flex-column space-around detail-book">
    <h2 class="info-product font-roboto text-blue">Título del Libro: ${producto.title}</h2>
    <h2 class="info-product font-roboto text-blue">Autor: ${producto.author}</h2>
    <h2 class="info-product font-roboto text-blue">Editorial: ${producto.publisher}</h2>
    <h2 class="info-product font-roboto text-blue">Fecha de publicación: ${producto.publisher_date}</h2>
    <h2 class="info-product font-roboto text-blue">Idioma: ${producto.language}</h2>
    <h2 class="info-product font-roboto text-blue">Categoría: ${categorias}</h2>
    <h2 class="info-product font-roboto text-blue">Reseña del libro:</h2>
    <p class="info-product font-roboto text-blue">${producto.content}</p>
    ${btn}
  </div>`).appendTo(document.getElementById("section-product"));
	createEvents();
}

function cargarProductoCompartir() {
	const producto = JSON.parse(localStorage.getItem("producto"));
	cargarAlHistorial(producto);
	document.getElementById("titulo").value = producto.title;
	document.getElementById("autor").value = producto.author;
}

function cargarProductosHistorial() {
	const productos = JSON.parse(localStorage.getItem("historial") || "[]");

	if (productos.length > 0) {
		productos.forEach((product) => {
			crearProduct(product);
		});
	}
}

function crearOption(category, idSelect) {
	let option = document.createElement("option");
	option.value = category.category_id || category.subcategory_id;
	option.innerHTML += category.name;
	document.getElementById(idSelect).appendChild(option);
}

function cargarCategoriasSelect(idSelect) {
	$.getJSON(`${URL}/?get_categories=all`, (results) => {
		results.forEach((category) => {
			crearOption(category, idSelect);
		});
	});
}

function cargarSubCategoriasSelect(idCategory, idSelect) {
	document.getElementById(idSelect).options.length = 1;
	$.getJSON(`${URL}/?get_subcategories_by_category_ID=${idCategory}`, (results) => {
		if (results.length === 0) {
			document.getElementById(idSelect).hidden = true;
			return;
		}
		results.forEach((category) => {
			crearOption(category, idSelect);
		});
		document.getElementById(idSelect).hidden = false;
	});
}

function buscar(event, bindForm) {
	event.preventDefault();

	params = [];
	bindForm.book_title.value
		? params.push({
				key: bindForm.book_title.name,
				value: bindForm.book_title.value,
		  })
		: "";

	bindForm.book_author.value
		? params.push({
				key: bindForm.book_author.name,
				value: bindForm.book_author.value,
		  })
		: "";

	bindForm.category_id.value !== "NINGUNO"
		? params.push({
				key: bindForm.category_id.name,
				value: bindForm.category_id.value,
		  })
		: "";

	bindForm.subcategory_id.value !== "NINGUNO"
		? params.push({
				key: bindForm.subcategory_id.name,
				value: bindForm.subcategory_id.value,
		  })
		: "";

	if (params.length === 0) {
		params = [
			{ key: "category", value: "libros_programacion" },
			{ key: "criteria", value: "most_vied" },
		];
	}
	getCustomParams(params);
}

function buscadorLimpiar() {
	document.getElementById("title").value = "";
	document.getElementById("author").value = "";
	document.getElementById("search__categorias").value = "NINGUNO";
	document.getElementById("search__subcategorias").value = "NINGUNO";
	document.getElementById("search__subcategorias").hidden = true;
}

function compartirCancelar() {
	window.history.back();
}

function emailForm(event, bindForm) {
	event.preventDefault();

	if (!bindForm.receptor.value || !bindForm.emisor.value) {
		Swal.fire({
			title: "Datos del formulario",
			icon: "error",
			html: `Emisor y Receptor son campos obligatorios.`,
		});
		return;
	}

	if (!validarEmail(bindForm.receptor.value) || !validarEmail(bindForm.emisor.value)) {
		Swal.fire({
			title: "Datos del formulario",
			icon: "error",
			html: `Emisor o Receptor son inválidos.`,
		});
		return;
	}

	let body_message = `Hola, te comparto este libro que te puede interesar.%0D%0ATítulo: ${bindForm.titulo.value}%0D%0AAutor: ${bindForm.autor.value}.`;
	if (bindForm.message.value) {
		body_message += `%0D%0A%0D%0ALa persona que te envía este mail además te quiere dar este mensaje:%0D%0A${bindForm.message.value}`;
	}
	encodeURIComponent(body_message);

	const mailto_link = `mailto:${bindForm.receptor.value}?subject=Mail de - ${bindForm.emisor.value} - Web Librería, libro compartido.&body=${body_message}`;
	window.open(mailto_link);
}

function validarEmail(input) {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(input);
}
