import { obterCookie } from '../utilsFront/cookie.js';


const publishForm = document.getElementById("publish-form");
const fileInput = document.getElementById('item-pic-input');
const fileNameSpan = document.getElementById('item-pic-file-name');
const btnPublishItem = document.getElementById('btn-publish-item');

fileInput.addEventListener('change', (event) =>{
    event.preventDefault();

  if (fileInput.files.length > 0) {
    fileNameSpan.textContent = fileInput.files[0].name;
      btnPublishItem.removeAttribute("disabled");
  } else {
    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
  }
});


  export async function uploadItemPic(file) {
    const formData = new FormData();
    formData.append('itemPic', file);
    try {
      const response = await fetch('http://localhost:3000/uploadItemPic', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        
        throw new Error(`Erro ao fazer upload: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro:', error.message);
      throw error;
    }
  }

publishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // const categoriItem = document.getElementById("item-categori-public");
    // const categoriItemValue = categoriItem.textContent;
    // if(categoriItemValue !== "Vestuário" || categoriItemValue !== "Suplemento" || categoriItemValue !== "Equipamento" || categoriItemValue !== "Acessório" ){
    //   categoriItemValue = undefined
    // }
    const nameItem = document.getElementById("item-name-public").value;
    const descriptionItem = document.getElementById("item-description-public").value;
    const priceItem = document.getElementById("item-price-public").value;
    const categoriItem = document.getElementById("item-categori-public");
    const categoriItemValue = categoriItem.textContent;
    const userId = obterCookie("id");
try {
    const file = fileInput.files[0];
    if (!file) {
        alert('Por favor, selecione uma imagem!');
        return;
      }
      const itemPic = await uploadItemPic(file);

    if(categoriItemValue === "Vestuário" || categoriItemValue === "Suplemento" || categoriItemValue === "Equipamento" || categoriItemValue === "Acessório" && nameItem.trim() && descriptionItem.trim() && !isNaN(priceItem) && priceItem > 0){
        const response = await fetch ("http://localhost:3000/addproduto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                categoria: categoriItemValue,
                nome: nameItem,
                descricao: descriptionItem,
                preco: priceItem,
                itemPic: itemPic.fileName,
                publishedBy: userId
            })
        })
        if(response.ok){
           alert("Item salvo com sucesso!");
           window.location.reload()  

        }else{
            throw new Error ("Problemas com a requisição!")
        }
        
    }else{
        alert("Algum campo está em branco")
        throw new Error ("Algum campo está em branco")
    }
    
} catch (err) {
    console.error(err)
}
})
