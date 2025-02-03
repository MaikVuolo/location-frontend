import { updateCartAllPages } from "../carrinho/cartPage.js";
import { obterCookie } from "../utilsFront/cookie.js";

async function items (){
    const search = localStorage.getItem("searchValue")
    const section = document.getElementById("search-principal-page");

    const response = await fetch(`https://location-backend-pmgg.onrender.com/pesquisa/${search}`)
    
    const itens = await response.json();
    console.log(itens);
    if(itens.length >= 1){
        if(section){
        
            itens.forEach((item) => {
                const itemCard = document.createElement("div");
                itemCard.classList.add(
                    "card",
                    "bg-success-subtle",
                    "rounded-0",
                    "border-0",
                    "col-12",
                    "col-md-6",
                    "col-xl-2",
                    "m-4");
                itemCard.innerHTML = `
                    <img class="img-fluid" src="${item.itemPic}" class="card-img-top" alt="pote de creatina">
                    <div class="card-body">
                    <h5 class="card-title pb-3">${item.nome}</h5>
                    <h6 class="py-3 fs-3">R$${item.preco},00</h6>
                    <p class="card-text">${item.descricao}</p>
                    </div>
                    <div class="card-footer text-body-secondary border-0 text-center">
                    <input type="hidden" name="productID" id="productId" value="${item._id}">
                    <button type="button" class="btn btn-dark btn_add_cart" id="btnCarrinho">Adicionar ao carrinho</button>
                `;
        
                section.appendChild(itemCard);
            });
            cartAddItem()    
        }        
    }else {
        section.innerHTML = `<h3 class="text-center mt-5"> Nenhum produto encontrado </h3>`
    }
    

    const title = document.getElementById("searchTitle");
    title.textContent = `Produtos encontrados na busca por: "${search}"`;
}



async function cartAddItem() {
    const buttons = document.querySelectorAll(".btn_add_cart");
    buttons.forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            event.preventDefault();
            const productId = event.target.closest(".card").querySelector("input[name='productID']").value;
            console.log(`Produto adicionado ao carrinho: ${productId}`);
            
                    try {
                        const response = await fetch(`https://location-backend-pmgg.onrender.com/findproduct/${productId}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const product = await response.json();
                        console.log(product);
                        const userId = obterCookie("id");
                        if(!userId){
                            alert("Você precisa estar logado para adicionar itens ao carrinho")
                            return;
                        }
                        const insertProductDb = await fetch("https://location-backend-pmgg.onrender.com/cartAdd", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ product, userId })
                        });
                        if (!insertProductDb.ok) {
                            throw new Error('Failed to add product to cart');
                        }
                        const result = await insertProductDb.json();
                        console.log(result);
                        updateCartAllPages();
                        alert("Item Adicionado ao Carrinho!")
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
})}

document.addEventListener("DOMContentLoaded", items)