const contactForm = document.querySelector('form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show a "Sending..." state to the user
    const submitBtn = contactForm.querySelector('.btn');
    let originalBtnText = "Submit";
    if (submitBtn) {
        originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
    }

    const data = {
        name: contactForm.querySelector('input[placeholder="Full Name"]').value,
        email: contactForm.querySelector('input[placeholder="Email Address"]').value,
        number: contactForm.querySelector('input[placeholder="Mobile Number"]').value,
        subject: contactForm.querySelector('input[placeholder="Email Subject"]').value,
        message: contactForm.querySelector('textarea').value
    };

    try {
        const response = await fetch('https://cyan-style-portfolio.onrender.com/contact', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Message Sent Successfully!");
            contactForm.reset();
        } else {
            // This catches 500 errors from the server
            alert(`Error: ${result.error || "Something went wrong!"}`);
        }
    } catch (error) {
        // This catches Network errors, CORS blocks, or Server timeouts
        console.error("Fetch error:", error);
        alert("Could not connect to the server. It might be waking up—please try again in 30 seconds.");
    } finally {
        // Re-enable the button
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});