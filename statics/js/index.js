const URL = "https://www.etnassoft.com/api/v1/get";

function getCategory(category = "all") {
  $.getJSON(`${URL}/?get_categories=${category}`, (results) =>
    console.log(results)
  );
}

function getSubCategory(category_id) {
  $.getJSON(
    `${URL}/?get_subcategories_by_category_ID=${category_id}`,
    (results) => console.log(results)
  );
}

function getCustom(param, value) {
  $.getJSON(`${URL}/?${param}=${value}`, (results) => console.log(results));
}

function getCustomParams(params) {
  let customUrl = "";
  params.forEach((p) => (customUrl += `${p.key}=${p.value}&`));
  // se remueve el último & concatenado en el forEach
  customUrl = customUrl.slice(0, -1);
  $.getJSON(`${URL}/?${customUrl}`, (results) => {
    cargarProductos(results);
    results.forEach((product) => {
      crearProduct(product);
    });
  });
}

function cargarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function crearProduct(product) {
  $(`<div class='container-product flex-column space-between'>
  <div class='container-image-product'>
      <img class='product' src='${product.thumbnail}' alt='producto'>
  </div>
  <h2 class='detail-product font-roboto'>Título del Libro: ${product.title}</h2>
  <h2 class='detail-product font-roboto'>Autor: ${product.author}</h2>
  <h2 class='detail-product font-roboto'>Precio:</h2>
  <div class='view-more flex-row space-around'>
      <h2 class='more-info'><a class='share' href='./share.html'>Compartir</a></h2>
      <span>|</span>
      <h2 class='container-view'><button class='view' onclick='irDetalle("${product.ID}")'>Ver +</button></h2>
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
  $(`<div class="container-photo-book">
    <img class="photo-book" src=${producto.cover} alt="producto">
  </div>
  <div class="flex-column space-around detail-book">
    <h2 class="info-product font-roboto">Título del Libro: ${producto.title}</h2>
    <h2 class="info-product font-roboto">Autor: ${producto.author}</h2>
    <h2 class="info-product font-roboto">Editorial: ${producto.publisher}</h2>
    <h2 class="info-product font-roboto">Fecha de publicación: ${producto.publisher_date}</h2>
    <h2 class="info-product font-roboto">Idioma: ${producto.language}</h2>
    <h2 class="info-product font-roboto">Categoría: ${categorias}</h2>
    <h2 class="info-product font-roboto">Reseña del libro:</h2>
    <p class="info-product font-roboto">${producto.content}</p>
    <button class="btn-add font-roboto text-white">Agregar al carrito</button>
  </div>`).appendTo(document.getElementById("section-product"));
}