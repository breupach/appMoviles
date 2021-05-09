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
  $.getJSON(`${URL}/?${customUrl}`, (results) => console.log(results));
}
