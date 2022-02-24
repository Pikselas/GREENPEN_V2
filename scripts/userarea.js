var UserCookie = {};
function CreateProjectPanel(Obj)
{
    let MainPanel = document.createElement("div");
    MainPanel.className = "ProjectPanel";
    MainPanel.setAttribute("onclick",`window.open("greenroom.html?code=${Obj["CODE"]}")`);
    let PanelBGImageChild = document.createElement("img");
    PanelBGImageChild.src = Obj["POSTER"];
    let PanelTitleChild = document.createElement("h1");
    PanelTitleChild.innerHTML = Obj["NAME"];
    MainPanel.appendChild(PanelBGImageChild);
    MainPanel.appendChild(PanelTitleChild);
    return MainPanel;
}

document.body.onload = ()=>{
    if(!(UserCookie = GetCookie()).hasOwnProperty("active_user_name"))
    {
        window.location = "home.html";
    }
    else
    {
        document.getElementById("userProfilePic").src = UserCookie["active_user_profile_pic"].replaceAll("%2F","/");
        document.getElementById("userTitle").innerHTML = UserCookie["active_user_name"];
        PerformAjaxRequest("GET",{},"../server/userarea.php?action=GET_PROJECTS","",true,(result)=>{
            result = JSON.parse(result);
            result.forEach((Obj)=>{
                setTimeout(()=>{
                    document.getElementById("PojectContainer").appendChild(CreateProjectPanel(Obj));
                },1);
            })
        });
    }
};
document.getElementById("Profile").onclick = ()=>{
    window.location = `userprofile.html?greenuser=${UserCookie["active_user_name"]}`;
}

/*
 SEARCH METHOD -> 
    normal ->results all the matchings as (project name alike , tag alike)
    filter modes -> query like -> TAGNAME:BMW,MERC  (unions all the tags)
*/
document.getElementById("ProjectSearcher").onchange = (ev)=>{
    PerformAjaxRequest("GET" , {} , "../server/userarea.php?action=SEARCH&query=" + ev.target.value , "" , true , (res)=>{
        res = JSON.parse(res);
        let Holder = document.getElementById("PojectContainer");
        Holder.innerHTML = "";
        res.forEach((Obj)=>{
            setTimeout(()=>{Holder.appendChild(CreateProjectPanel(Obj))} , 1);
        });
    });
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
                   window.location = "greenroom.html?code=" + response["projectcode"]; 
                }
                else
                {
                    alert(response["error"]);
                }
        });
    }
}