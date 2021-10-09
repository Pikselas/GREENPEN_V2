var SuppliedData = GetPathData();
document.body.onload = ()=>{
    if(SuppliedData.hasOwnProperty("greenuser"))
    {
        PerformAjaxRequest("GET",{},`../server/userprofile.php?greenuser=${SuppliedData["greenuser"]}`,"",true,(response)=>{
            response = JSON.parse(response);
            if(response.hasOwnProperty("PROFILEPIC"))
            {
                document.getElementById("ProfilePic").src = response["PROFILEPIC"];
                document.getElementById("UserName").innerHTML = SuppliedData["greenuser"];
            }
        })
    }
}
document.getElementById("ProfilePic").onclick = ()=>{
    if(SuppliedData["greenuser"] == GetCookie()["active_user_name"])
    {
        let InPut = document.createElement("input");
        InPut.type = "file";
        InPut.accept = "image/*";
        InPut.onchange = ()=>{
            PerformAjaxRequest("POST",{},"../server/userprofile.php",CreateFormData({ProfileImage:InPut.files[0]}),true,(response)=>{
                if(response == "true")
                {
                    document.getElementById("ProfilePic").src = URL.createObjectURL(InPut.files[0]);
                }
            })
        }
        InPut.click();
    }   
}