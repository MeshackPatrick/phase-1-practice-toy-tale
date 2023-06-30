let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    createToy(name, image);
    e.target.reset();
  });

  toyCollection.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      const toyId = e.target.dataset.id;
      const likeCount = parseInt(e.target.previousElementSibling.innerText);
      updateLikes(toyId, likeCount + 1);
    }
  });

  fetchToys();

  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          createToyCard(toy);
        });
      });
  }

  function createToy(name, image) {
    const toyData = {
      name: name,
      image: image,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((response) => response.json())
      .then((toy) => {
        createToyCard(toy);
      });
  }

  function updateLikes(toyId, likeCount) {
    const likeData = {
      likes: likeCount,
    };

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(likeData),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        const card = document.querySelector(`[data-id="${updatedToy.id}"]`);
        const likeElement = card.querySelector("p");
        likeElement.innerText = `${updatedToy.likes} Likes`;
      });
  }

  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = toy.id;

    const nameElement = document.createElement("h2");
    nameElement.innerText = toy.name;

    const imageElement = document.createElement("img");
    imageElement.src = toy.image;
    imageElement.className = "toy-avatar";

    const likeElement = document.createElement("p");
    likeElement.innerText = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.innerText = "Like ❤️";
    likeButton.className = "like-btn";
    likeButton.dataset.id = toy.id;

    card.appendChild(nameElement);
    card.appendChild(imageElement);
    card.appendChild(likeElement);
    card.appendChild(likeButton);

    toyCollection.appendChild(card);
  }
});
