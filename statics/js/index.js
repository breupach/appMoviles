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
  sessionStorage.setItem("productos", JSON.stringify(productos));
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
  let productos = JSON.parse(sessionStorage.getItem("productos"));
  const producto = productos.filter((p) => p.ID === idProducto)[0];
  sessionStorage.setItem("producto", JSON.stringify(producto));
  location.href = location.origin + "/product.html";
}

function cargarProductoDetalle() {
  const producto = JSON.parse(sessionStorage.getItem("producto"));
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
