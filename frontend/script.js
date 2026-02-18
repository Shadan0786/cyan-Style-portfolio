const contactForm = document.querySelector('form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    const data = {
        name: contactForm.querySelector('input[placeholder="Full Name"]').value,
        email: contactForm.querySelector('input[placeholder="Email Address"]').value,
        number: contactForm.querySelector('input[placeholder="Mobile Number"]').value,
        subject: contactForm.querySelector('input[placeholder="Email Subject"]').value,
        message: contactForm.querySelector('textarea').value
    };

    const response = await fetch('https://cyan-style-portfolio.onrender.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Message Sent!");
        contactForm.reset();
    } else {
        alert("Something went wrong!");
    }
});