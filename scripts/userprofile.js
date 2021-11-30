var SuppliedData = GetPathData();
var ResPonse = {};
document.body.onload = ()=>{
    if(SuppliedData.hasOwnProperty("greenuser"))
    {
        PerformAjaxRequest("GET",{},`../server/userprofile.php?greenuser=${SuppliedData["greenuser"]}`,"",true,(response)=>{
            response = JSON.parse(response);
            if(response.hasOwnProperty("PROFILEPIC"))
            {
                document.getElementById("ProfilePic").src = response["PROFILEPIC"];
                document.getElementById("UserName").innerHTML = response["USERNAME"];
                ResPonse = response;
            }
        })
    }
}
document.getElementById("ProfilePic").onclick = ()=>{
    if(ResPonse["USERNAME"] == GetCookie()["active_user_name"])
    {
        let InPut = document.createElement("input");
        InPut.type = "file";
        InPut.accept = "image/*";
        InPut.onchange = ()=>{
            PerformAjaxRequest("POST",{},"../server/userprofile.php",CreateFormData({ProfileImage:InPut.files[0]}),true,(response)=>{
                if(response == "true")
                {
                    let Src = URL.createObjectURL(InPut.files[0]);
                    document.getElementById("ProfilePic").src = Src
                    setTimeout(()=>{URL.revokeObjectURL(Src)},1);
                }
            })
        }
        InPut.click();
    }   
}