// Theme e modal
var body = document.getElementById("body");

function toggleTheme() {
    body.classList.toggle("night-mode");
}

function handleSignInModal() {
    body.classList.toggle("modal-toggle");
}

// Carrossel
const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");

document.addEventListener("DOMContentLoaded", () => {
    const slideWidth = slide.clientWidth;
    let currentIndex = 0;

    const nextSlide = () => {
        currentIndex++;
        if (currentIndex >= slidesContainer.children.length) {
            currentIndex = 0;
        }
        slidesContainer.scrollTo({
            left: currentIndex * slideWidth,
            behavior: 'smooth'
        });
    };

    setInterval(nextSlide, 4000);
});

// API: Livros
const livrosUrl = "http://localhost:5287/api/Book";

function fetchAndDisplayLivros(endpoint) {
    const div_container = document.getElementsByClassName("container")[0];

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.map(element => {
                let card = document.createElement("div");
                card.classList.add("card");

                let divCover = document.createElement("div");
                divCover.classList.add("div-cover");

                let img = document.createElement("img");
                img.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDJvhbUIPa09Bpuf4_zBPzTP9noLhwoysvt6JXsJWV8essbMLW3VsAw01apJuoaRUAijcN1TVX12aMPlb3lLCY4UvQugvoSvmR19E8Cg9BHeOmPco85CQR-WE79CxzFdklRFqUY8auGH0/s1600/Conhe%25C3%25A7a+os+4+Tipos+de+Capas+de+Livro+que+os+Designers+Normalmente+Desenvolvem+-+Arquiteto+Vers%25C3%25A1til+-+Rafael+Nascimento+%252812%2529.jpg";

                let a = document.createElement("a");
                a.classList.add("detalhes");
                a.textContent = "Detalhes";

                divCover.appendChild(img);
                divCover.appendChild(a);
                card.appendChild(divCover);
                div_container.appendChild(card);
            });
        });
}

fetchAndDisplayLivros(livrosUrl);

// API: Gêneros
const genreUrl = "http://localhost:5287/api/LiteraryGenre";

function fetchAndDisplayGenre(url) {
    const genreContainer = document.getElementsByClassName('genre-container')[0];

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.map(genre => {
                let genreCard = document.createElement("div");
                genreCard.classList.add("genre-card");

                let h3 = document.createElement("h3");
                h3.innerText = genre.name;

                genreCard.appendChild(h3);
                genreContainer.appendChild(genreCard);
            });
        });
}

fetchAndDisplayGenre(genreUrl);

// Select de Gêneros
function fetchAndDisplaySelectGenre(url) {
    const genreSelect = document.getElementsByClassName('form-select')[0];

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.map(el => {
                let option = document.createElement('option');
                option.textContent = el.name;
                option.value = el.id;
                genreSelect.appendChild(option);
            });
        });
}

fetchAndDisplaySelectGenre(genreUrl);

// Criar livro
async function createBook(e) {
    e.preventDefault();

    const selectUrl = "http://localhost:5287/api/Book";
    let genreSelect = document.getElementsByClassName("form-select")[0];

    let titulo = document.getElementById("titulo").value;
    let autor = document.getElementById("autor").value;
    let descricao = document.getElementById("descricao").value;
    let quantidade = document.getElementById("quantidade").value;
    let isbn = document.getElementById("isbn").value;
    let anoPublicacao = document.getElementById("anoPublicacao").value;
    let editora = document.getElementById("editora").value;
    let genreId = parseInt(genreSelect.value);
    let genreName = genreSelect.options[genreSelect.selectedIndex].text;

    // Validação mínima
    if (!titulo || !autor || !editora || !anoPublicacao || !quantidade || !genreId) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const dados = {
        title: titulo,
        publicationYear: parseInt(anoPublicacao),
        quantity: parseInt(quantidade),
        summary: descricao, // corrigido de sumary para summary
        authors: autor.split(',').map(a => a.trim()), // array de strings
        publisher: editora,
        isbn: isbn,
        literaryGenre: {
            id: genreId,
            name: genreName
        }
    };

    try {
        const paramns = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        };

        const response = await fetch(selectUrl, paramns);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('Sucesso:', resultado);
        alert('Livro cadastrado com sucesso!');
        document.getElementById("bookForm").reset();
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao cadastrar o livro. Tente novamente.');
    }
}

// Vincula o form
document.getElementById("bookForm")?.addEventListener("submit", createBook);
