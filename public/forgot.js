const form1 = document.getElementById("form");
const form2 = document.getElementById("form2");
const form3 = document.getElementById("form3");
const email = document.getElementById("email");
const otpno = document.getElementById("otp");
const password = document.getElementById("pass");

form1.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("hi");
    const rawResponse = await fetch('http://localhost:4000/forgotpassword', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.value })
    }).then((response) => response.json())
        .then((data) => {
            if (data.flag === "success") {
                form1.style.display = "none";
                form2.style.display = "block";
            }
        });


})

form2.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("gi");
    const rawResponse = await fetch('http://localhost:4000/forgotpasswordotp', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp: otpno.value })
    }).then((response) => response.json())
        .then((data) => {
            if (data.flag === "success") {
                form2.style.display = "none";
                form3.style.display = "block";
            }
        });
})

form3.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("bi");
    const rawResponse = await fetch('http://localhost:4000/changepassword', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.value, password: password.value })
    }).then((response) => response.json())
        .then((data) => {
            if (data.flag === "success") {
                window.location.href="/login"
            }
        });

})