document.onload = ()=>{
    if(GetCookie().hasOwnProperty("active_user_id"))
    {
        window.location = "userarea.html";
    }
}
document.getElementById("EntryPoint").onclick = ()=>{
    window.location = "userentry.html";
}