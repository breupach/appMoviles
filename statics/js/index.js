const URL = "https://www.etnassoft.com/api/v1/get";
let limite = 10;
let numDevuelto = 0;
let numPaginas = 0;
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

function getCustomParams(params) {
	borrarProductosVista();
	let customUrl = "";
	params.forEach((p) => (customUrl += `${p.key}=${p.value}&`));
	// se remueve el último & concatenado en el forEach
	customUrl = customUrl.slice(0, -1);

	//contar cantidad para paginacion
	$.getJSON(`${URL}/?${customUrl}&count_items=true`, (num) => {
		numDevuelto = num;
		numPaginas = Math.ceil(num?.num_items / limite);
		cargasNumPaginas(numPaginas);
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

function cargasNumPaginas(numPaginas) {
	document.getElementById("section-pagination").innerHTML = "";
	if (numPaginas > 0) {
		$(`
    <button class="page box-shadow text-blue" type="button"><<</button>
    ${forPaginas(numPaginas)}
    <button class="page box-shadow text-blue" type="button">>></button>
    
    `).appendTo(document.getElementById("section-pagination"));
	}
}

function forPaginas(numPaginas) {
	paginas = "";
	for (let num = 1; num <= numPaginas; num++) {
		paginas += `<button class="page box-shadow text-blue" onclick="getWithPagination(${
			num - 1
		})" type="button">${num}</button>`;
	}
	return paginas;
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
	$(`<div class='container-product flex-column space-between box-shadow align-center'>
  <div class='container-image-product'>
      <img class='product' src='${product.thumbnail}' alt='producto'>
  </div>
  <div class="detail-info-book flex-column space-between">
    <h2 class='detail-product font-roboto text-blue'>Título del Libro: ${product.title}</h2>
    <h2 class='detail-product font-roboto text-blue'>Autor: ${product.author}</h2>
    <h2 class='detail-product font-roboto text-blue'>Precio:</h2>
  </div>
  <div class='view-more flex-row space-around align-center'>
      <h2 class='more-info'><a class='share align-center text-blue' href='./share.html'>Compartir</a></h2>
      <span>|</span>
      <h2 class='container-view'><button class='view align-center' onclick='irDetalle("${product.ID}")'>Ver +</button></h2>
  </div>
  <button class='btn-add font-roboto text-white'>Agregar al carrito</button>
</div>`).appendTo(document.getElementById("section-product"));
}

function irDetalle(idProducto) {
	let productos = JSON.parse(localStorage.getItem("productos"));
	const producto = productos.filter((p) => p.ID === idProducto)[0];
	localStorage.setItem("producto", JSON.stringify(producto));
	location.href = location.origin + "/product.html";
}

function cargarProductoDetalle() {
	const producto = JSON.parse(localStorage.getItem("producto"));
	console.log(producto);
	let categorias = [];
	producto.categories.forEach((category) => categorias.push(category.name));
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
    <button class="btn-add font-roboto text-white">Agregar al carrito</button>
  </div>`).appendTo(document.getElementById("section-product"));
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

	getCustomParams(params);
}
