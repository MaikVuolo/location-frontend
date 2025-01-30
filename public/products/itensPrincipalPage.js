import { obterCookie } from "../utilsFront/cookie.js";
import { updateCartAllPages } from "../carrinho/cartPage.js";

const suplementos = document.getElementById("suplementos-principal-page");
const vestuario = document.getElementById("vestuario-principal-page");
const acessorios = document.getElementById("acessorios-principal-page");
const equipamentos = document.getElementById("equipamentos-principal-page");

const categories = ["Suplemento", "Vestuário", "Acessório", "Equipamento"];

export async function getItens() {
    const userId = obterCookie("id")
    try {
        const promises = categories.map(async (category) => {
            const response = await findCategory(category);

            if (response) {
                response.forEach((item) => {
                    const itemCard = document.createElement("div");
                    itemCard.classList.add(
                        "card",
                        "bg-success-subtle",
                        "rounded-0",
                        "border-0",
                        "col-12",
                        "col-md-6",
                        "col-xl-4",
                        "m-4"
                    );
                    itemCard.style.width = "18rem";

                    const imgSrc = item.itemPic
                        ? `/public/assets/uploads/${item.itemPic}`
                        : "/public/assets/no-img.webp";

                    itemCard.innerHTML = `
                        <img class="img-fluid" src="${imgSrc}" class="card-img-top" alt="${item.nome}">
                        <div class="card-body">
                            <h5 class="card-title pb-3">${item.nome}</h5>
                            <h6 class="py-3 fs-3">R$${item.preco},00</h6>
                            <p class="card-text">${item.descricao}</p>
                            <div id="item-edit"></div>
                        </div>
                        <div class="card-footer text-body-secondary border-0 text-center">
                            <input type="hidden" name="productID" id="productId" value="${item._id}">
                            <button type="button" class="btn btn-dark btn_add_cart" id="btnCarrinho">Adicionar ao carrinho</button>
                        </div>

                    `;

                    switch (category) {
                        case "Suplemento":
                            suplementos.appendChild(itemCard);
                            break;
                        case "Vestuário":
                            vestuario.appendChild(itemCard);
                            break;
                        case "Acessório":
                            acessorios.appendChild(itemCard);
                            break;
                        case "Equipamento":
                            equipamentos.appendChild(itemCard);
                            break;
                        default:
                            console.warn("Categoria não encontrada:", category);
                    }
                });
            } else {
                throw new Error("Erro ao buscar itens");
            }
        });

        await Promise.all(promises);
        cartAddItem(); // Adiciona os event listeners após carregar todos os itens
    } catch (err) {
        console.error(err);
    }
}

async function findCategory(categoria){
    try {
        const itensCategory = await fetch(`https://location-backend-pmgg.onrender.com/findproductcategory/${categoria}`,)
        const itens = await itensCategory.json()
    
        if(!itens){
            throw new Error("Nenhum item encontrado")
        }
        return itens;
    } catch (err) {
        console.error(err)
    }
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

document.addEventListener("DOMContentLoaded", getItens)
