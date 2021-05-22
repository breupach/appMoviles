
function createEventAdd(){
    $(".btn-add").on("click", function(event){

        id = $(event.target).data("id")
        price = $(event.target).data("price")

        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito === null){
            carrito = {}
        }
        carrito[id] = price
        localStorage.setItem("carrito", JSON.stringify(carrito));

        $(event.target).removeClass('btn-add')
        $(event.target).addClass('btn-del')
        $(event.target).text("Eliminar del carrito")
        createEventDel()
        UpdateCarrito()    
    })
}

function createEventDel(){
    $(".btn-del").on("click", function(event){

        id = $(event.target).data("id")

        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito === null){
            carrito = {}
        }
        delete carrito[id]
        localStorage.setItem("carrito", JSON.stringify(carrito));

        $(event.target).removeClass('btn-del')
        $(event.target).addClass('btn-add')
        $(event.target).text("Agregar al carrito")      
        createEventAdd()
        UpdateCarrito() 
    })
}

function UpdateCarrito(){
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    if (carrito === null){
        carrito = {}
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    let total_price = 0
    let total_items = 0
    for (const id in carrito) {
        total_price += carrito[id] 
        total_items ++
    }

    $("#total_price").text(total_price)
    $("#total_items").text(total_items)
}

function createEvents(){
    createEventAdd()
    createEventDel()
    UpdateCarrito() 
}