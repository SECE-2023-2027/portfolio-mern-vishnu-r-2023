// Script to handle form submission
document.getElementById("contact").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const result = await response.json();
    const contactMessage = document.getElementById("contactMessage");

    if (response.ok) { // If response is OK (status code 200-299)
      contactMessage.textContent = result.message;
      contactMessage.style.color = "green"; // Optional: change color for success
      document.getElementById("contact").reset(); // Clear the form
    } else {
      contactMessage.textContent = result.message || "Failed to send your message. Please try again.";
      contactMessage.style.color = "red"; // Optional: change color for failure
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    const contactMessage = document.getElementById("contactMessage");
    contactMessage.textContent = "An error occurred. Please try again later.";
    contactMessage.style.color = "red"; // Optional: change color for error
  }
});

// Masonry Initialization after all images are loaded
window.addEventListener('load', function() {
  // Function to load a single image
  const loadImage = src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve();
    image.src = src;
  });

  // Function to check if all images are loaded in the container
  async function allImagesLoaded(selector) {
    const container = document.querySelector(selector);
    if (container === null) {
      return;
    }

    const images = container.querySelectorAll('img');
    return Promise.all([...images].map(
      src => loadImage(src)
    ));
  }

  // Wait for all images inside #posts .grid to load
  allImagesLoaded('#posts .grid').then(() => {
    // Initialize Masonry after images are loaded
    new Masonry("#posts .grid", {
      itemSelector : '.grid-item',
      gutter : 20
    });
  });
});
