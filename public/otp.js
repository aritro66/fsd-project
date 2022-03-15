var email = document.getElementById("email")
document.getElementById("generate").addEventListener('click', async () => {
    console.log(email.value);
    // if (email.value !== "") {
        const rawResponse = await fetch('http://localhost:4000/otp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email:email.value})
        });
        const content = await rawResponse.json();

        console.log(content);
    // }
})