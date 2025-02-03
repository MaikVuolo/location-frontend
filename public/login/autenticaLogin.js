import { definirCookie } from "../utilsFront/cookie.js";
import { addCartToStorage } from "../carrinho/cartPage.js";
// import verifyJwt from "../utilsFront/verifyJwt.js";

const formLogin = document.getElementById("loginForm");
const btnLogin = document.getElementById("botoesLogin")

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userName = document.getElementById('userName').value;
  const password = document.getElementById('password').value;
  

  try {
    const response = await fetch ('https://location-backend-pmgg.onrender.com/autenticar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName, password })
    })
    if(response.ok){
      
      const resposta = await response.json();
      const tokenJwt = resposta.acessToken
      definirCookie('tokenJwt', tokenJwt)
      
      const id = resposta.id;
      definirCookie('id', id)
      addCartToStorage()
      const usuario = resposta.nome;
      const profilePicPath = resposta.profilePic
      
      
      if(profilePicPath === null || profilePicPath === undefined){
        alert('sucesso no login')
        window.location.reload()
        
        btnLogin.innerHTML = `
        <a data-bs-toggle="offcanvas" data-bs-target="#userPainel" aria-controls="userPainel">
        <div class="d-flex">
              <h3 class="fs-3  ms-3 mb-0 mt-1 me-1">
              ${usuario}
              </h3>
              
              <i class="bi bi-person-circle img-perfi m-0 fs-3"></i>
          </div>
          </a>
              `
              localStorage.setItem('usuarioLogado', JSON.stringify({
                nomeUsuario: usuario,
                imagemPerfil:null }));             
      }else{
        alert('sucesso no login')
        window.location.reload()

        btnLogin.innerHTML = `
        <a data-bs-toggle="offcanvas" data-bs-target="#userPainel" aria-controls="userPainel">
        <div class="d-flex">
              <h3 class="fs-3  ms-3 mb-0 mt-1 me-1">
              ${usuario}
              </h3>
              <img class="img-fluid rounded-circle img-perfil m-0" src="${profilePicPath}" alt="Imagem perfil">
          </div>
          </a>
              `
        localStorage.setItem('usuarioLogado', JSON.stringify({
          nomeUsuario: usuario,
          imagemPerfil: profilePicPath
        }));
      }
      
    }else{
      console.log(response);
      
      alert("Login não autorizado")
    }
  } catch (error) {
      console.error('erro : ', error)
  }

  })

  