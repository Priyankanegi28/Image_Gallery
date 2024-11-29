// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const images = document.querySelectorAll('#imageGallery img');

    images.forEach(image => {
        const title = image.getAttribute('data-title').toLowerCase();
        if (title.includes(searchTerm)) {
            image.style.display = 'block';  // Show the image if it matches the search
        } else {
            image.style.display = 'none';  // Hide the image if it doesn't match
        }
    });
});

// Get the modal elements
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const downloadLink = document.getElementById("downloadLink");
const closeBtn = document.querySelector(".close");
const heartIcon = document.getElementById("heartIcon");  // Heart icon for favorites
const favoritesPage = document.getElementById("favoritesPage");
const nextIcon = document.getElementById("nextIcon");  // Next icon
const prevIcon = document.getElementById("prevIcon");  // Previous icon
const favoriteImages = [];  // Store favorite images
const popupMessage = document.getElementById('popupMessage'); // Popup message element

// Get all gallery items
const galleryItems = document.querySelectorAll(".gallery-item img");
let currentIndex = 0;  // Track current image index

// Function to show the popup message
function showPopupMessage(message) {
    popupMessage.textContent = message;  // Set the message content
    popupMessage.classList.add('show');  // Show the popup

    // Automatically hide the popup after 2 seconds
    setTimeout(() => {
        popupMessage.classList.remove('show');
    }, 2000);
}

// Function to open the modal and set the image
function openModal(index) {
    modal.style.display = "flex";
    currentIndex = index;
    modalImg.src = galleryItems[currentIndex].src;
    downloadLink.href = galleryItems[currentIndex].src;

    // Reset heart icon for every modal opening
    if (favoriteImages.includes(galleryItems[currentIndex].src)) {
        heartIcon.classList.add('favorited');  // Add red heart class
    } else {
        heartIcon.classList.remove('favorited');  // Remove red heart class
    }
}

// Add event listener to all gallery items to open the modal
galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        openModal(index);
    });
});

// Close the modal
closeBtn.onclick = function() {
    modal.style.display = "none";
};

// Handle heart icon for favorites
heartIcon.addEventListener("click", function() {
    const currentImage = modalImg.src;

    if (favoriteImages.includes(currentImage)) {
        // Remove from favorites
        const index = favoriteImages.indexOf(currentImage);
        favoriteImages.splice(index, 1);
        heartIcon.classList.remove('favorited');  // Turn heart white
        removeFromFavorites(currentImage);  // Remove image from favorites page

        // Show popup message for removal
        showPopupMessage("Your image is removed from favorites");
    } else {
        // Add to favorites
        favoriteImages.push(currentImage);
        heartIcon.classList.add('favorited');  // Turn heart red
        addToFavorites(currentImage);  // Add image to favorites page

        // Show popup message for addition
        showPopupMessage("Your image is added to favorites");
    }
});

// Existing Next and Previous functionality
nextIcon.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openModal(currentIndex);
});

prevIcon.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openModal(currentIndex);
});

// Adding keyboard functionality for Next and Previous
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {  // Right arrow key for Next
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openModal(currentIndex);
    } else if (event.key === "ArrowLeft") {  // Left arrow key for Previous
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openModal(currentIndex);
    }
});


// Add image to favorites page
function addToFavorites(imageSrc) {
    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('gallery-item');
    favoriteItem.innerHTML = `<img src="${imageSrc}" alt="Favorite Image">`;
    favoritesPage.appendChild(favoriteItem);
}

// Remove image from favorites page
function removeFromFavorites(imageSrc) {
    const favoriteItems = favoritesPage.querySelectorAll('.gallery-item img');
    favoriteItems.forEach(item => {
        if (item.src === imageSrc) {
            item.parentElement.remove();  // Remove the image and its container
        }
    });
}

// Show favorites page when the favorites button is clicked
document.getElementById('favoritesButton').addEventListener('click', () => {
    imageGallery.classList.add('hidden');
    uploadPage.classList.add('hidden');
    favoritesPage.classList.remove('hidden');
});




// Upload page functionality
document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    const uploadButton = document.getElementById('uploadButton');
    const uploadPage = document.getElementById('uploadPage');
    const imageGallery = document.getElementById('imageGallery');
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('preview');

    // Show and hide sections when buttons are clicked
    homeButton.addEventListener('click', () => {
        imageGallery.classList.remove('hidden');
        uploadPage.classList.add('hidden');
        favoritesPage.classList.add('hidden');
    });

    uploadButton.addEventListener('click', () => {
        uploadPage.classList.remove('hidden');
        imageGallery.classList.add('hidden');
        favoritesPage.classList.add('hidden');
    });

    // Handle drag and drop
    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#f1f1f1';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '#f9f9f9';
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#f9f9f9';
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                // Create preview for each image
                const previewContainer = document.createElement('div');
                previewContainer.classList.add('preview-container');

                const img = document.createElement('img');
                img.src = event.target.result;
                img.classList.add('preview-image');

                // Create buttons for Delete and Upload
                const imageActions = document.createElement('div');
                imageActions.classList.add('image-actions');

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = "Delete";

                const uploadButton = document.createElement('button');
                uploadButton.classList.add('upload');
                uploadButton.textContent = "Upload";

                // Append buttons and image to preview container
                imageActions.appendChild(deleteButton);
                imageActions.appendChild(uploadButton);
                previewContainer.appendChild(img);
                previewContainer.appendChild(imageActions);
                previewArea.appendChild(previewContainer);

                // Handle Delete Button
                deleteButton.addEventListener('click', () => {
                    previewContainer.remove();  // Remove image and buttons from preview
                });

                // Handle Upload Button
                uploadButton.addEventListener('click', () => {
                    // Add image to the gallery on the home page
                    const newGalleryItem = document.createElement('div');
                    newGalleryItem.classList.add('gallery-item');
                    newGalleryItem.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image">`;
                    imageGallery.appendChild(newGalleryItem);

                    previewContainer.remove();  // Remove image and buttons from preview after upload
                });
            };
            reader.readAsDataURL(file);
        });
    }
});


// Create page


document.addEventListener('DOMContentLoaded', () => {
    const folderInput = document.getElementById('folderInput'); // Folder input field
    const folderList = document.getElementById('folderList');   // Folder list to display created folders
    const fileInput = document.getElementById('fileInput');     // Hidden file input to select images
    const createPage = document.getElementById('createPage');   // Create folder section
    const homeButton = document.getElementById('homeButton');     // Home button
    const uploadButton = document.getElementById('uploadButton');   // Upload button
    const favoritesButton = document.getElementById('favoritesButton'); // Favorites button
    const imageGallery = document.getElementById('imageGallery'); // Image gallery section
    const favoritesPage = document.getElementById('favoritesPage'); // Favorites page
    const uploadPage = document.getElementById('uploadPage');      // Upload page
    const createButton = document.getElementById('createButton');   // Create button

    let folders = {}; // Object to store folders and their images

    // Show create folder section when Create button is clicked
    createButton.addEventListener('click', () => {
        imageGallery.classList.add('hidden');
        uploadPage.classList.add('hidden');
        favoritesPage.classList.add('hidden');
        createPage.classList.remove('hidden');
    });

    // Handle folder creation
    document.getElementById('createFolderBtn').addEventListener('click', () => {
        const folderName = folderInput.value.trim();
        
        // Check if the folder name is valid and doesn't already exist
        if (folderName !== "" && !folders[folderName]) {
            folders[folderName] = [];  // Initialize empty array for the folder's images

            // Create folder UI element
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder-item');
            folderDiv.innerHTML = `
                <h3>${folderName} <button class="fas fa-trash-alt deleteFolderBtn"></button></h3>

                <div class="folder-images"></div>
                <button class="fa-regular fa-images addImageToFolderBtn"> Add Images</button>
            `;

            // Append folder to the folder list
            folderList.appendChild(folderDiv);

            // Clear the input field after creating the folder
            folderInput.value = '';

            // Handle adding images to the folder
            folderDiv.querySelector('.addImageToFolderBtn').addEventListener('click', () => {
                // Trigger the hidden file input
                fileInput.click();

                // After images are selected, add them to the folder
                fileInput.onchange = function () {
                    const files = fileInput.files;
                    if (files.length > 0) {
                        for (const file of files) {
                            const reader = new FileReader();
                            reader.onload = function (event) {
                                // Create image element
                                const img = document.createElement('img');
                                img.src = event.target.result;

                                // Append the image to the folder's image container
                                folderDiv.querySelector('.folder-images').appendChild(img);

                                // Add image to the folder's internal image list (for further use if needed)
                                folders[folderName].push(img);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                };
            });

            // Handle deleting the folder
            folderDiv.querySelector('.deleteFolderBtn').addEventListener('click', () => {
                // Remove folder from the display
                folderList.removeChild(folderDiv);

                // Remove folder from the internal folders object
                delete folders[folderName];
            });
        } else {
            alert('Folder name already exists or is empty.');
        }
    });

    // Show and hide sections when buttons are clicked
    homeButton.addEventListener('click', () => {
        imageGallery.classList.remove('hidden');
        uploadPage.classList.add('hidden');
        favoritesPage.classList.add('hidden');
        createPage.classList.add('hidden'); // Hide create folder section
    });

    uploadButton.addEventListener('click', () => {
        uploadPage.classList.remove('hidden');
        imageGallery.classList.add('hidden');
        favoritesPage.classList.add('hidden');
        createPage.classList.add('hidden'); // Hide create folder section
    });

    favoritesButton.addEventListener('click', () => {
        favoritesPage.classList.remove('hidden');
        imageGallery.classList.add('hidden');
        uploadPage.classList.add('hidden');
        createPage.classList.add('hidden'); // Hide create folder section
    });
});
// notification



document.addEventListener('DOMContentLoaded', () => {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');

    // Toggle dropdown visibility on click
    notificationIcon.addEventListener('click', () => {
        notificationDropdown.classList.toggle('hidden');
    });

    // Optional: Close dropdown if clicking outside of it
    document.addEventListener('click', (event) => {
        if (!notificationIcon.contains(event.target) && !notificationDropdown.contains(event.target)) {
            notificationDropdown.classList.add('hidden');
        }
    });
});




// Pagination buttons


// Pagination variables
let currentPage = 1;
const itemsPerPage = 32; // Adjust the number of items to display per page
const totalItems = document.querySelectorAll('.gallery-item').length; // Total gallery items
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Function to display images for the current page
function displayPage(page) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) 
            ? 'block' 
            : 'none';
    });

    updatePaginationButtons(); // Update pagination buttons
}

// Function to create pagination buttons dynamically
function createPaginationButtons() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        paginationContainer.appendChild(button);
    }

    // Add "Previous" and "Next" buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });
    paginationContainer.prepend(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Function to update the active page button
function updatePaginationButtons() {
    const paginationButtons = document.querySelectorAll('.pagination-button');
    paginationButtons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        }
    });
}

// Initialize pagination on page load
document.addEventListener('DOMContentLoaded', () => {
    createPaginationButtons();
    displayPage(currentPage); // Display the first page on load
});


document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    const uploadButton = document.getElementById('uploadButton');
    const favoritesButton = document.getElementById('favoritesButton');
    const imageGallery = document.getElementById('imageGallery');
    const uploadPage = document.getElementById('uploadPage');
    const favoritesPage = document.getElementById('favoritesPage');
    const pagination = document.getElementById('pagination'); // Select the pagination section

    // Show Home page and pagination when the Home button is clicked
    homeButton.addEventListener('click', () => {
        imageGallery.classList.remove('hidden');
        uploadPage.classList.add('hidden');
        favoritesPage.classList.add('hidden');
        pagination.style.display = 'flex'; // Show pagination
    });

    // Hide pagination when the Upload page is active
    uploadButton.addEventListener('click', () => {
        uploadPage.classList.remove('hidden');
        imageGallery.classList.add('hidden');
        favoritesPage.classList.add('hidden');
        pagination.style.display = 'none'; // Hide pagination
    });

    // Hide pagination when the Favorites page is active
    favoritesButton.addEventListener('click', () => {
        favoritesPage.classList.remove('hidden');
        imageGallery.classList.add('hidden');
        uploadPage.classList.add('hidden');
        pagination.style.display = 'none'; // Hide pagination
    });
});
