function definirCookie(chave, valor){
    return document.cookie = `${chave}=${valor};path=/`;
}


function obterCookie(chave) {
  if (document.cookie) {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find(cookie => cookie.startsWith(chave + '='));
      if (cookie) {
          return cookie.split('=')[1];
      }
  }
  return null;
}

function removerCookie(chave) {
  document.cookie = `${chave}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function checkJwtCookie(token) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(token)) {
        // Cookie encontrado
        return true;
      }
    }
    // Cookie não encontrado
    return false;
  }

export { definirCookie, obterCookie, removerCookie, checkJwtCookie };