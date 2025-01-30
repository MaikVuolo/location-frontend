// import { obterCookie } from "../utilsFront/cookie.js";
// import { updateCart } from "./cartPage.js";

// const itens = document.getElementById("itens");

// itens.addEventListener("click", async (event) => {
//     event.preventDefault();

//     // Verifica se o clique foi no botão com a classe "btn_add_cart"
//     if (event.target.classList.contains("btn_add_cart")) {
//         const productId = event.target
//             .closest(".card")
//             .querySelector("input[name='productID']").value;

//         console.log(`Produto adicionado ao carrinho: ${productId}`);
//         try {
//             const response = await fetch(`http://localhost:3000/findproduct/${productId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const product = await response.json();
//             console.log(product);

//             const userId = obterCookie("id");
//             const insertProductDb = await fetch("http://localhost:3000/cartAdd", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ product, userId })
//             });

//             if (!insertProductDb.ok) {
//                 throw new Error('Failed to add product to cart');
//             }

//             const result = await insertProductDb.json();
//             console.log(result);
//             updateCart();
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// });