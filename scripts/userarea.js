var UserCookie = {};
document.body.onload = ()=>{
    console.log()
    if(!(UserCookie = GetCookie()).hasOwnProperty("active_user_name"))
    {
        window.location = "home.html";
    }
    else
    {
        document.getElementById("userProfilePic").src = UserCookie["active_user_profile_pic"].replaceAll("%2F","/");
        document.getElementById("userTitle").innerHTML = UserCookie["active_user_name"];
    }
};
document.getElementById("Profile").onclick = ()=>{
    window.location = `userprofile.html?greenuser=${UserCookie["active_user_name"]}`;
}
document.getElementById("LogOut").onclick = LogOut;