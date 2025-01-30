

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const search = document.getElementById("search-input").value;

    localStorage.setItem("searchValue", search)

    window.location.href = "/public/searchProduct/searchPage.html";
    

})

