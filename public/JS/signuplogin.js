var pass=document.getElementById("passicon");
var repass=document.getElementById("repassicon");
var inputpass=document.getElementById("pass");
var inputrepass=document.getElementById("repass");

function validateForm()   
{
    if (inputpass.value==inputrepass.value) {
        return true;
    } else {
        alert("Password not matching");
        return false;
    }
}

pass.addEventListener("click",()=>{
    if(pass.classList.contains("fa-eye"))
    {
        pass.classList.add("fa-eye-slash");
        pass.classList.remove("fa-eye");
        inputpass.setAttribute("type","text");
    }
    else
    {
        pass.classList.add("fa-eye");
        pass.classList.remove("fa-eye-slash");
        inputpass.setAttribute("type","password");
    }
});

inputpass.addEventListener("focus",()=>{
    if(pass.classList.contains("fa-eye"))
    {
        document.getElementById("eyeband").style.display="block";
    }
    else
    {
        document.getElementById("eyeband").style.display="none";
    }
});

inputpass.addEventListener("blur",()=>{
    document.getElementById("eyeband").style.display="none";
});

repass.addEventListener("click",()=>{
    if(repass.classList.contains("fa-eye"))
    {
        repass.classList.add("fa-eye-slash");
        repass.classList.remove("fa-eye");
        inputrepass.setAttribute("type","text");
    }
    else
    {
        repass.classList.add("fa-eye");
        repass.classList.remove("fa-eye-slash");
        inputrepass.setAttribute("type","password");
    }
});

inputrepass.addEventListener("focus",()=>{
    if(repass.classList.contains("fa-eye"))
    {
        document.getElementById("eyeband").style.display="block";
    }
    else
    {
        document.getElementById("eyeband").style.display="none";
    }
});

inputrepass.addEventListener("blur",()=>{
    document.getElementById("eyeband").style.display="none";
});