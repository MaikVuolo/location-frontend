const form = document.getElementById('userForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userName = document.getElementById('userNameCreate').value;
    const password = document.getElementById('passwordCreate').value;
    const role = document.getElementById('roleCreate').value
    const email = document.getElementById("email").value
    

    try {
        const resposta = await fetch ('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, password, role, email })
          })
          if(!resposta.ok){
            const mensagemErro = await resposta.text();
            throw new Error(mensagemErro);
          }else{
            alert("Conta criada com sucesso")
            window.location.href = "http://127.0.0.1:5501/public/index.html"

          }
          
    } catch (error) {
        console.error('erro : ', error)

        if (error.message.includes("usuario já existe")) {
          alert("Erro: Este usuário já existe.");
      } else if (error.message.includes("É necessario fornecer um email válido")) {
          alert("Erro: É necessário fornecer um email válido.");
      } else {
          alert("Erro: Algo deu errado. Tente novamente.");
      }
    }

    })