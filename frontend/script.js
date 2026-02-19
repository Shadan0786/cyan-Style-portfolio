const contactForm = document.querySelector('form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Button Feedback
    const submitBtn = contactForm.querySelector('.btn') || contactForm.querySelector('button');
    let originalBtnText = "Submit";
    if (submitBtn) {
        originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
    }

    // 2. Data Collection
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

        // 3. Robust JSON Parsing
        const contentType = response.headers.get("content-type");
        let result = {};
        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        }

        if (response.ok && result.success) {
            alert("Message Sent Successfully!");
            contactForm.reset();
        } else {
            // Displays specific error from Resend or Server
            alert(`Error: ${result.error || "The server is having trouble sending the mail."}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Server is waking up (this can take 30-60s on Render). Please try one more time!");
    } finally {
        if (submitBtn) {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    }
});