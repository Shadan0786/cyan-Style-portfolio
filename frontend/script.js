const contactForm = document.querySelector('form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn') || contactForm.querySelector('button');
    let originalBtnText = "Submit";
    
    if (submitBtn) {
        originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
    }

    // .trim() added to clean up accidental spaces
    const data = {
        name: contactForm.querySelector('input[placeholder="Full Name"]').value.trim(),
        email: contactForm.querySelector('input[placeholder="Email Address"]').value.trim(),
        number: contactForm.querySelector('input[placeholder="Mobile Number"]').value.trim(),
        subject: contactForm.querySelector('input[placeholder="Email Subject"]').value.trim(),
        message: contactForm.querySelector('textarea').value.trim()
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

        const contentType = response.headers.get("content-type");
        let result = {};
        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        }

        // Logic matches the new server.js res.status(200).json({ success: true })
        if (response.ok && result.success) {
            alert("✅ Message Sent Successfully!");
            contactForm.reset();
        } else {
            alert(`❌ Error: ${result.error || "The server received the request but failed to send the email."}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        // Better messaging for Render Free Tier users
        alert("⏳ Server is waking up... Render's free tier takes about 30 seconds to start. Please wait a moment and click Submit again.");
    } finally {
        if (submitBtn) {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    }
});