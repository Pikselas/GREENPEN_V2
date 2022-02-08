var ProjectCode;
document.body.onload = ()=>{
    let PathData = GetPathData();
    if(PathData.hasOwnProperty("code"))
    {
        PerformAjaxRequest("GET",{},"../server/greenroom.php?code="+PathData["code"],"",true,(response)=>{
            response = JSON.parse(response);
            if(response["success"])
            {
                document.getElementById("ProjectLgT").children[0].src = response["POSTER"];
                document.getElementById("ProjectLgT").children[1].innerHTML = response["NAME"];
                ProjectCode = response["CODE"];
                delete response["success"];
                delete response["POSTER"];
                let dtlsArea = document.getElementById("ProjectDtls");
                let Table = document.createElement("table");
                let AuthorRow = document.createElement("tr");
                AuthorRow.innerHTML = `<td>AUTHOR-ID</td><td>${response["AUTHORID"]}</td>`;
                let LastUpdateRow = document.createElement("tr");
                LastUpdateRow.innerHTML = `<td>LAST-UPDATED</td>${response["UPDATED"]}<td></td>`;
                let ProjectCodeRow = document.createElement("tr");
                ProjectCodeRow.innerHTML = `<td>PROJECT-CODE</td>${response["CODE"]}<td></td>`
                Table.appendChild(AuthorRow);
                Table.appendChild(LastUpdateRow);
                Table.appendChild(ProjectCodeRow)
                dtlsArea.appendChild(Table);
                console.log(response);
            }
        });
    }
}
document.getElementById("OpenButton").onclick = ()=>{
    window.open("greeneditor.html?code="+ProjectCode);
}
