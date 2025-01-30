import { obterCookie, checkJwtCookie } from "./utilsFront/cookie.js";




// minhasCompras.addEventListener("click", async (event)=> {
//   event.preventDefault();
//   try {
//       const cookieVerify = checkJwtCookie("tokenJwt=")
//       if(!cookieVerify){
//         alert("Você precisa fazer o login para acessar o carrinho de compras");
//       }else{
//         const cookieJwt = obterCookie ("tokenJwt")
      
//         const response = await fetch ('http://localhost:3000/verificar', {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${cookieJwt}`  }
//           })
//         if(response.ok){
//           // const data = await response.json();
//           window.location.href = "http://127.0.0.1:5501/public/carrinho/index.html"
//         }

//       }
//   }
//   catch (err) {
//       console.error('erro : ', err)
//   }
// })
    