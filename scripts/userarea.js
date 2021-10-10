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
        console.log(UserCookie);
    }
};
document.getElementById("Profile").onclick = ()=>{
    window.location = `userprofile.html?greenuser=${UserCookie["active_user_name"]}`;
}
document.getElementById("LogOut").onclick = LogOut;
document.getElementById("NewProject").onclick = ()=>{
    let ProjectName = prompt("Enter Project Name");
    if(ProjectName != null)
    {
        PerformAjaxRequest("GET",{},`../server/userarea.php?action=NEW_PROJECT&project_name=${ProjectName}`,"",true,(response)=>{    
            response = JSON.parse(response);
            console.log(response);
                if(response["success"])
                {
                   window.location = "greenland.html?projectcode=" + response["projectcode"]; 
                }
                else
                {
                    alert(response["error"]);
                }
        });
    }
}