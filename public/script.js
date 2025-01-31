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
      body: JSON.stringify({ name, email,subject, message }),
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
