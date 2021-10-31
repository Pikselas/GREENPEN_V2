document.body.onload = ()=>{
    let PathData = GetPathData();
    if(PathData.hasOwnProperty("code"))
    {
        PerformAjaxRequest("GET",{},"../server/greenroom.php?code="+PathData["code"],"",true,(response)=>{
            response = JSON.parse(response);
            console.log(response);
            if(response["success"])
            {
                document.getElementById("ProjectLgT").children[0].src = response["POSTER"];
                document.getElementById("ProjectLgT").children[1].innerHTML = response["NAME"];
            }
        });
    }
}