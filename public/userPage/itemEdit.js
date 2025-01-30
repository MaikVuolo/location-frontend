import { obterCookie } from "../utilsFront/cookie.js";
import { uploadItemPic } from "../products/publishItem.js";

const section = document.getElementById("painel-vendedor");
const fileInput = document.getElementById('item-edit-pic-input');
const fileNameSpan = document.getElementById('item-edit-pic-file-name');

async function getItensPublished(){
    try {
        const userId = obterCookie("id")
        const items = await fetch(`https://location-backend-pmgg.onrender.com/itemsforuser/${userId}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const itensPublished = await items.json();
        console.log(itensPublished);
        

        if(!itensPublished){
            throw new Error("Nenhum item publicado");
        }

        itensPublished.items.forEach((item) => {
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

            itemCard.dataset.itemData = JSON.stringify(item); 

            itemCard.innerHTML = `
                <img class="img-fluid" src="/Imagens/uploads/${item.itemPic}" class="card-img-top" alt="pote de creatina">
                <div class="card-body">
                <h5 class="card-title pb-3">${item.nome}</h5>
                <h6 class="py-3 fs-3">R$${item.preco},00</h6>
                <p class="card-text">${item.descricao}</p>
                </div>
                <div class="card-footer text-body-secondary border-0 text-center d-flex justify-content-around">
                <input type="hidden" name="productID" id="productId" value="${item._id}">
                <button type="button" class="btn btn-warning btn-item-edit" data-bs-toggle="modal" data-bs-target="#edit-item-modal">
                Editar item
                </button>
                <button type="button" class="btn btn-danger delete-item" id="btnCarrinho">Excluir item</button>
                </div>
            `;

            section.appendChild(itemCard);
        });

        const btnEditar = document.querySelectorAll(".btn-item-edit");
        btnEditar.forEach((button) => {
            button.addEventListener("click", () => {
                const itemCard = button.closest('.card');
                const itemData = JSON.parse(itemCard.dataset.itemData);

                const category = document.getElementById("item-categori-edit");
                const itemName = document.getElementById("item-name-edit");
                const itemDescription = document.getElementById("item-description-edit");
                const itemPrice = document.getElementById("item-price-edit");

                category.textContent = itemData.categoria;
                itemName.value = itemData.nome;
                itemDescription.value = itemData.descricao;
                itemPrice.value = itemData.preco;
                
                const itemIdInput = document.getElementById('itemIdInput'); 
                itemIdInput.value = itemData._id; 

                const itemOriginalPic = document.getElementById("itemOriginalPic")
                itemOriginalPic.value = itemData.itemPic;
                
            })
        })

        const btnExcluir = document.querySelectorAll(".delete-item");
        btnExcluir.forEach((button) => {
            button.addEventListener("click", async () => {
                const itemCard = button.closest('.card');
                const itemData = JSON.parse(itemCard.dataset.itemData);
                const itemId = itemData._id;
                const routeDelete = await fetch(`https://location-backend-pmgg.onrender.com/removeitem/${itemId}`,{
                    method: "DELETE"
                })

                if(!routeDelete.ok){
                    throw new Error ("Erro ao deletar item")
                }else{
                    alert("Item excluido com sucesso")
                    window.location.reload();
                }
                
                
            })
        })

    } catch (err) {
        console.error(err);
    }
}

fileInput.addEventListener('change', (event) =>{
    event.preventDefault();

  if (fileInput.files.length > 0) {
    fileNameSpan.textContent = fileInput.files[0].name;
  } else {
    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
  }
});

const editForm = document.getElementById("edit-item-form");

editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const itemId = document.getElementById("itemIdInput").value
    const categoria = document.getElementById("item-categori-edit").textContent;
    const nome = document.getElementById("item-name-edit").value;
    const descricao = document.getElementById("item-description-edit").value;
    const preco = document.getElementById("item-price-edit").value
    let itemPicValue;
    const file = fileInput.files[0];
    if (!file) {
        itemPicValue = document.getElementById("itemOriginalPic").value
      }else{
        const itemPic = await uploadItemPic(file);
        itemPicValue = itemPic.fileName;
      }  
    
    try {
        const response = await fetch("https://location-backend-pmgg.onrender.com/edititem", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: itemId,
                update:{
                categoria: categoria,
                nome: nome,
                descricao: descricao,
                preco: preco,
                itemPic: itemPicValue
        }})
        })
        const resposta = await response.json()
        if(!response.ok){
            throw new Error("Erro ao atualizar produto")
        }
        alert("Item editado com sucesso!")
        window.location.reload();
        console.log(resposta);
        
        
    } catch (err) {
        alert("erro")
        console.log(err);
        
    }
})



document.addEventListener("DOMContentLoaded", getItensPublished)