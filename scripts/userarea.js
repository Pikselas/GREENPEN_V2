var UserCookie = {};
document.body.onload = ()=>{
    if(!(UserCookie = GetCookie()).hasOwnProperty("active_user_name"))
    {
        window.location = "home.html";
    }
    document.getElementById("userProfilePic").src = UserCookie["active_user_profile_pic"].replaceAll("%2F","/");
};