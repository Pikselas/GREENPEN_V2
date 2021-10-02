document.body.onload = ()=>{
    if(GetCookie().hasOwnProperty("active_user_name"))
    {
        window.location = "userarea.html";
    }
};
document.getElementById("EntryPoint").onclick = ()=>{
    window.location = "userentry.html";
}