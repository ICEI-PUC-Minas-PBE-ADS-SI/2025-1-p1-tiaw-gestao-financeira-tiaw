document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/educacao');
    const noticias = await response.json();

    const container = document.getElementById('favoritos-container');
    const favoritas = noticias.filter(n => n.favoritado);

    favoritas.forEach(noticia => {
      const card = document.createElement('div');
      card.className = 'card-noticia favorito-card';

      card.innerHTML = `
        <img src="${noticia.banner}" alt="${noticia.titulo}">
        <h3>${noticia.titulo}</h3>
        <p>${noticia.resumo}</p>
        <i class="fas fa-heart favorite-icon favorito" data-id="${noticia.id}"></i>
      `;

      card.querySelector('img').addEventListener('click', () => abrirModal(noticia));
      card.querySelector('h3').addEventListener('click', () => abrirModal(noticia));
      card.querySelector('p').addEventListener('click', () => abrirModal(noticia));
      card.querySelector('.favorite-icon').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorito(noticia.id, e.target, card);
      });

      container.appendChild(card);
    });

    function abrirModal(noticia) {
      document.getElementById('modal-titulo').textContent = noticia.titulo;
      document.getElementById('modal-imagem').src = noticia.banner;
      document.getElementById('modal-conteudo').innerHTML = noticia.texto;
      document.getElementById('modal').style.display = 'block';
    }

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
      });
    }

    async function toggleFavorito(id, icon, card) {
      const url = `http://localhost:3000/educacao/${id}`;
      const res = await fetch(url);
      const noticia = await res.json();
      const novoStatus = !noticia.favoritado;

      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ favoritado: novoStatus })
      });

      if (!novoStatus) {
        card.remove(); // Remove o card da tela se desfavoritar
      }

      icon.classList.toggle("favorito", novoStatus);
    }

  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
});
