import { obterCookie } from "../utilsFront/cookie.js";


const cartHTML = document.getElementById("productsCart");
const cartTotal = document.getElementById("totalCompras");
const itensAdicionados = document.getElementById("itens-adicionados");
const btnEndCart = document.getElementById("btn-end-cart");
const itensScreenSM = document.getElementById("itens-adicionados-sm");
const cartHtmlSm = document.getElementById("products-cart-sm")
const cartTotalSm = document.getElementById("total-compras-sm");



export  async function addCartToStorage() {
        try {
            const userId = obterCookie("id");
            const response = await fetch(`https://location-backend-pmgg.onrender.com/getcart/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error("Erro ao buscar o carrinho do servidor");
            }
    
            const cartAndTotal = await response.json();
            const cart = cartAndTotal.cart;
            localStorage.setItem("cart", JSON.stringify({cart}));
            console.log("Carrinho salvo no Local Storage com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o carrinho no Local Storage:", error);
        }
    }

    export async function updateCartAllPages (){
    
        try {
            const userId = obterCookie("id");
            const response = await fetch(`https://location-backend-pmgg.onrender.com/getcart/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                
                throw new Error("Erro ao buscar o carrinho do servidor");
            }
    
            const cartAndTotal = await response.json();
            const cart = cartAndTotal.cart;
            const total = cartAndTotal.total;
            localStorage.setItem("cart", JSON.stringify({cart}));
            localStorage.setItem("totalCart", JSON.stringify({total}));
    
        } catch (error) {
            console.error("Erro ao atualizar o carrinho no Local Storage:", error);
        }
    }


export async function updateCart (){
    
    try {
        const userId = obterCookie("id");
        const response = await fetch(`https://location-backend-pmgg.onrender.com/getcart/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            
            throw new Error("Erro ao buscar o carrinho do servidor");
        }

        const cartAndTotal = await response.json();
        
        const cart = cartAndTotal.cart;
        const total = cartAndTotal.total;
        localStorage.setItem("cart", JSON.stringify({cart}));
        localStorage.setItem("totalCart", JSON.stringify({total}));

        cartTotalSm.innerHTML = `R$${total.toFixed(2)}`;
        cartTotal.innerHTML = `R$${total.toFixed(2)}`;
    } catch (error) {
        console.error("Erro ao atualizar o carrinho no Local Storage:", error);
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

function impressProduct () {
    const cart = getCart()
    console.log(cart);
    
    cartHTML.innerHTML = ""
    cartTotalSm.innerHTML = ""
    itensAdicionados.innerHTML = ""
    itensScreenSM.innerHTML = ""

    cart.cart.forEach((product, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("card",
                        "bg-success-subtle",
                        "rounded-0",
                        "border-0",
                        "col-12",
                        "col-md-6",
                        "col-xl-3",
                        "pb-3");
            cartItem.innerHTML = `
                    <img class="img-fluid" src="${product[0].itemPic}" class="card-img-top" alt="pote de creatina">
                    <div class="card-body">
                    <h5 class="card-title pb-3">${product[0].nome}</h5>
                    <h6 class="py-3 fs-3">R$${product[0].preco},00</h6>
                    <h6 class="py-3 fs-3">Quantidade: ${product[1]}</h6>
                    </div>
                    <div class="card-footer text-body-secondary border-0 text-center">
                    <input type="hidden" name="productID" id="productId" value="${product[0]._id}">
                    <input type="hidden" name="index" id="productIndex" value="${index}">
                    <button type="button" class="btn btn-dark" id="btnRemoveItem">Remover do carrinho</button>
                    
            `
            const itensCard = document.createElement("div");
            itensCard.innerHTML = `
            <p class="card-text"><span class="mt-1 text-black" >${product[0].nome}: ${product[1]} unidade</span></p>
            `

            const removeButton = cartItem.querySelector("#btnRemoveItem");
            removeButton.addEventListener("click", async (event) => {
                event.preventDefault();
    
                const userId = obterCookie("id");
                console.log(userId);
    
                try {
                    const response = await fetch("https://location-backend-pmgg.onrender.com/removecartitem", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId, index })
                    });
    
                    const teste = await response.json();
                    updateCart ()
                    alert("Item Removido!")
                    window.location.reload()
                } catch (err) {
                    console.error("Error:", err);
                }
            });
            
            cartHTML.appendChild(cartItem);
            cartHtmlSm.appendChild(cartItem.cloneNode(true));
            itensAdicionados.appendChild(itensCard);
            itensScreenSM.appendChild(itensCard.cloneNode(true));

        })
    };
if(btnEndCart){

    btnEndCart.addEventListener("click", async (event) => {
        event.preventDefault()
    
        const userId = obterCookie("id");
        try {
            if(!userId){
                throw new Error("Id de usuario não existe")
            }
        
            const response = await fetch (`https://location-backend-pmgg.onrender.com/endcart/${userId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            if(!response.ok){
                alert("Falha ao finalizar compra")
                throw new Error("Falha ao finalizar compra")
            }
            alert("Compra finalizada com sucesso!")
            window.location.reload()
        } catch (err) {
            console.error(err.message)
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    if (cartHTML) {
        if (obterCookie("id") === null || obterCookie("id") === undefined) {
            window.location.href = "../index.html"
            alert("Você precisa estar logado para acesso a essa página!")
        } else {    
            updateCart();
            impressProduct();
        }
    }
});
