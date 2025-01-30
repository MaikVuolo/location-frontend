import { checkJwtCookie, obterCookie } from "../utilsFront/cookie.js";


const form = document.getElementById('uploadForm');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const userId = obterCookie("id") // Captura o ID do usuário
      const fileInput = document.getElementById('profilePicInput');
      const file = fileInput.files[0]; // Obtém o arquivo selecionado

      const cookieVerify = checkJwtCookie("tokenJwt=")
      if(!cookieVerify){
        alert("Você precisa fazer o login para acessar o carrinho de compras");
      }else{
        const cookieJwt = obterCookie ("tokenJwt")
      
        const autorizado = await fetch ('http://localhost:3000/verificar', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${cookieJwt}`  }
          })

      try {
        if (autorizado) {
              
          if (!file) {
            alert('Por favor, selecione uma imagem!');
            return;
          }

          const response = await uploadProfilePic(userId, file);
          
          console.log('Resposta do servidor:', response);

          const usuarioLogadoString = localStorage.getItem('usuarioLogado');
          const usuarioLogado = JSON.parse(usuarioLogadoString);

          // Modificar a propriedade desejada
          const caminhoImg = response.profilePic;
          
          const caminhoReal = caminhoImg.split("Loja");
          
          if (caminhoReal.length > 1) {
            usuarioLogado.imagemPerfil = caminhoReal[1];
        } else {
            console.error('Erro: Caminho de imagem inválido.');
        }

          // Atualizar o localStorage
          localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
          alert('Foto de perfil enviada com sucesso!');
      } else {
        throw new Error('Faça Login novamente')
      }
      } catch (error) {
        
        alert('Erro ao enviar a foto: ' + error.message);
      }
    }});

    // Função fetch para upload
    async function uploadProfilePic(userId, file) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('profilePic', file);
      

      try {
        const response = await fetch('http://localhost:3000/uploadProfilePic', {
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