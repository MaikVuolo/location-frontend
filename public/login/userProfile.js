import { removerCookie } from "../utilsFront/cookie.js";

const fileInput = document.getElementById('profilePicInput');
const fileNameSpan = document.getElementById('fileName');
const buttonSendImg = document.getElementById('buttonSendImg');
const buttonLogout = document.getElementById('buttonLogout');
const btnLogin = document.getElementById("botoesLogin");




fileInput.addEventListener('change', (event) =>{
    event.preventDefault();

  if (fileInput.files.length > 0) {
    fileNameSpan.textContent = fileInput.files[0].name;
    buttonSendImg.innerHTML = `<button type="submit" class="btn btn-success fs-6">Salvar imagem</button>`
  } else {
    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
  }
});

buttonLogout.addEventListener('click', (event) => {
    event.preventDefault();

    removerCookie('tokenJwt');
    removerCookie('id');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('cart');
    localStorage.removeItem('totalCart');

    alert('Deslogado com sucesso')
    window.location.reload();
    
})


function dataUser () {
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

if (usuarioLogado) {
  // Use os dados do usuário, por exemplo:
  const nomeUsuario = usuarioLogado.nomeUsuario;
  const imagemPerfil = usuarioLogado.imagemPerfil;

  // Atualizar o DOM com os dados recuperados
  if(imagemPerfil === null || imagemPerfil === undefined){
    // window.location.href = "/home"
    
    btnLogin.innerHTML = `
    <a data-bs-toggle="offcanvas" data-bs-target="#userPainel" aria-controls="userPainel">
    <div class="d-flex">
          <h3 class="fs-3  ms-3 mb-0 mt-1 me-1">
          ${nomeUsuario}
          </h3>
          
          <i class="bi bi-person-circle img-perfi m-0 fs-3"></i>
      </div>
      </a>
          `
    
  }else{
    btnLogin.innerHTML = `
    <a data-bs-toggle="offcanvas" data-bs-target="#userPainel" aria-controls="userPainel">
    <div class="d-flex ">
          <h3 class="fs-3  ms-3 mb-0 mt-1 me-1">
          ${nomeUsuario}
          </h3>
          <img class="img-fluid rounded-circle img-perfil m-0" src="${imagemPerfil}" alt="Imagem perfil">
      </div>
      </a>
          `
  }
}
}
document.addEventListener("DOMContentLoaded", () => {
  // Função a ser executada ao abrir a página
  dataUser()
});