//Fetch category API
async function getCategoryData() {
  const url = "https://openapi.programming-hero.com/api/peddy/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    displayCategories(json.categories);
  } catch (error) {
    console.error(error.message);
  }
}

const loadCategoryPets = (category) =>{
      fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
      .then((res) => res.json())
      .then((data)=>displayAllPets(data.data))
      .catch((error)=>console.log(error));
};

const displayCategories = (json) => {
    const categoryContainer = document.getElementById("categories");
    
    json.forEach((item) => {
        console.log(item);

        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = `
        <button onclick="loadCategoryPets('${item.category}')"class="category_btn">
            <img src="${item.category_icon}" alt="" class="w-12 h-12 inline-block mr-2">
            ${item.category}
        </button>
        `;
        categoryContainer.append(buttonContainer);
    });
};



//Fetch All Pets API
async function getAllPetData() {
  const url = "https://openapi.programming-hero.com/api/peddy/pets";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    displayAllPets(json.pets);
  } catch (error) {
    console.error(error.message);
  }
}

const loadDetails = async (petId) =>{
     console.log(petId);
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    displayDetails(data.petData); //petData is in API

}

// Array to keep track of liked pet IDs
const likedPetIds = [];

const likePet = async (likedPet) => {
  if (likedPetIds.includes(likedPet)) {
    alert("You already liked this pet");
    return;
  }

  likedPetIds.push(likedPet);

  const url = `https://openapi.programming-hero.com/api/peddy/pet/${likedPet}`;
  const res = await fetch(url);
  const data = await res.json();

  const likeContainer = document.getElementById("likedPets");

  // Create an img element for the liked pet and set its source
  const img = document.createElement("img");
  img.src = data.petData.image;
  img.classList.add("liked-image"); 

  // Append the new image to the likeContainer div
  likeContainer.appendChild(img);
}


const adoptPet = async (adoptedPet, button) => {
  const url = `https://openapi.programming-hero.com/api/peddy/pet/${adoptedPet}`;
  const res = await fetch(url);
  const data = await res.json();

  const adoptContainer = document.getElementById("modal2-content");

  let countdown = 3;
 adoptContainer.innerHTML = `
  <div style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 30vh;">
    <i class="fa-regular fa-handshake" style="font-size: 3rem; margin-bottom: 1rem;"></i>
    <h1 style="font-size: 2rem; font-weight: bold; color: #4caf50;">Congratulations!</h1>
    <p style="font-size: 1.2rem; color: #555;">The adoption process has started for your pet.</p>
    <p style="font-size: 1.5rem; font-weight: bold; color: #ff5722;">
      <span id="countdown">${countdown}</span>
    </p>
  </div>
`;


  // Start the countdown
  const interval = setInterval(() => {
    countdown--;
    document.getElementById("countdown").innerText = countdown;

    if (countdown === 0) {
      clearInterval(interval);

  
       document.getElementById("my_modal_2").close();

     
      button.innerText = "Adopted";
      button.disabled = true;
    //  button.classList.add("disabled"); 
    }
  }, 1000);

  document.getElementById("showModal2").click();
};




const sortPet = async () => {
  try {
    const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets'); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
     const pets = data.pets;

    const sortedPets = pets.sort((a, b) => b.price - a.price);
    
    // Display sorted pets
    displayAllPets(sortedPets);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};




const displayDetails = (petDetails) => {
  console.log(petDetails);
  const detailContainer = document.getElementById("modal1-content");


  const breed = petDetails.breed || "Not Available";
  const category = petDetails.category || "Not Available";
  const dateOfBirth = petDetails.date_of_birth || "Not Available";
  const gender = petDetails.gender || "Not Available";
  const petDetailsText = petDetails.pet_details || "No additional details available";
  const petName = petDetails.pet_name || "Unnamed";
  const price = petDetails.price !== undefined && petDetails.price !== null ? `$${petDetails.price}` : "Price not available";
  const vaccinatedStatus = petDetails.vaccinated_status || "Not Available";

  detailContainer.innerHTML = `
    <div class="p-4">
      <img 
        src="${petDetails.image}" 
        alt="Pet Image" 
        class="w-full h-64 object-cover rounded-lg mb-4" 
      />
      <p class="mb-2"><b>Breed:</b> <span class="ml-2">${breed}</span></p>
      <p class="mb-2"><b>Category:</b> <span class="ml-2">${category}</span></p>
      <p class="mb-2"><b>Date of Birth:</b> <span class="ml-2">${dateOfBirth}</span></p>
      <p class="mb-2"><b>Gender:</b> <span class="ml-2">${gender}</span></p>
      <p class="mb-2"><b>Pet Details:</b> <span class="ml-2">${petDetailsText}</span></p>
      <p class="mb-2"><b>Pet Name:</b> <span class="ml-2">${petName}</span></p>
      <p class="mb-2"><b>Price:</b> <span class="ml-2">${price}</span></p>
      <p class="mb-2"><b>Vaccinated Status:</b> <span class="ml-2">${vaccinatedStatus}</span></p>
    </div>
  `;


  document.getElementById("showModal1").click();
};





const displayAllPets = (pets) => {
  const cardContainer = document.getElementById("cards");

  // Show spinner
  cardContainer.innerHTML = `
    <div class="grid place-items-center h-full col-span-3">
      <div class="text-center flex flex-col items-center">
        <div class="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        <p class="mt-2 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    cardContainer.innerHTML = ""; // Clear spinner or any previous content

    if (!pets || pets.length === 0) {
      // Display error message
      cardContainer.innerHTML = `
        <div class="grid place-items-center h-full col-span-3">
          <div class="text-center flex flex-col items-center">
            <img src="./images/error.webp" alt="No pets available" class="w-24 h-24 mb-4" />
            <p class="text-lg font-semibold text-gray-600">No pets available for this category</p>
          </div>
        </div>
      `;
      return;
    }

    pets.forEach((item) => {
      const card = document.createElement("div");
      card.classList = "card card-compact";

      const petName = item.pet_name || "";
      const breed = item.breed || "";
      const price = item.price !== undefined && item.price !== null ? `${item.price}` : ""; //handling 0
      const dateOfBirth = item.date_of_birth || "";
      const gender = item.gender || "";

      card.innerHTML = `
        <figure>
          <img 
            src="${item.image || './images/placeholder.jpg'}" 
            alt="Image not found" 
            class="w-full h-48 object-cover rounded-lg" />
       </figure>

        <div class="card-body">
          <h1 class="text-2xl font-bold">${petName}</h1>
          <p class=""><b>Breed:</b> ${breed}</p>
          <p class=""><b>Price:</b> ${price}</p>
          <p class=""><b>Birth:</b> ${dateOfBirth}</p>
          <p class=""><b>Gender:</b> ${gender}</p>
          <hr>
          <div class="card-actions flex justify-center items-center gap-4">
            <button onClick="likePet('${item.petId}')"><i class="fa-regular fa-thumbs-up text-2xl"></i></button>
            <button onClick="adoptPet('${item.petId}', this)" class="btn btn-ghost text-blue-600/100 border-2 !border-blue-200 !rounded-lg">Adopt</button>
            <button onClick="loadDetails('${item.petId}')" class="btn btn-ghost text-blue-600/100 border-2 !border-blue-200 !rounded-lg">Details</button>
          </div>
        </div>
      `;
      cardContainer.append(card);
    });
  }, 2000); // Set timeout for 2 seconds
};











getCategoryData();
getAllPetData();

