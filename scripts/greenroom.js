var ProjectCode;
document.body.onload = ()=>{
    let PathData = GetPathData();
    if(PathData.hasOwnProperty("code"))
    {
        PerformAjaxRequest("GET",{},"../server/greenroom.php?code="+PathData["code"],"",true,(response)=>{
            response = JSON.parse(response);
            if(response["success"])
            {
                ProjectCode =  PathData["code"];
                document.getElementById("ProjectLgT").children[0].src = response["POSTER"];
                document.getElementById("ProjectLgT").children[1].innerHTML = response["NAME"];
                document.getElementById("AuthorID").innerHTML = response["AUTHORID"];
                document.getElementById("LastUpdateID").innerHTML = response["UPDATED"];
                document.getElementById("CodeID").innerHTML = PathData["code"];
                let TagSec = document.getElementById("TagArea");
                response["TAGS"].forEach((val)=>{
                    let Tag = document.createElement("span");
                    Tag.innerHTML = val;
                    TagSec.appendChild(Tag);
                });
                let AddTag = document.createElement("span");
                AddTag.innerHTML = "+";
                AddTag.style.fontSize = "large";
                AddTag.style.fontWeight = "900";
                AddTag.style.backgroundColor = "rgba(254, 77, 77, 0.87)"
                TagSec.appendChild(AddTag);
            }
        });
    }
}
document.getElementById("OpenButton").onclick = ()=>{
    window.open("greeneditor.html?code="+ProjectCode);
}
