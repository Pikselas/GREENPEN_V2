var PROJECT_JSON = {};
var DefaultPath = "";
var NewAdd = {"VIDEOS" : {} , "FOLDERS" : {}};
var Changes = {} ; // { ID1 : {"source" : "","dest":"" },ID2 : {"source" : "","dest":"" }}
var TempFileS = {}; // {ID : {blob : "",dest : "real_path"}}
window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
  },false);
document.body.onload = ()=>{
    let PathData = GetPathData();
    if(PathData.hasOwnProperty("code"))
    {
        PerformAjaxRequest("GET",{},"../server/greeneditor.php?type=GET_PROJECT&&code=" + PathData["code"],"",true,(response)=>{
            response = JSON.parse(response);
            if(response["success"])
            {
                if (response.hasOwnProperty("def_path"))
                {
                    DefaultPath = response["def_path"];
                    delete response["def_path"];
                }
                delete response["success"];
                Object.keys(response).forEach((key)=>{
                    if(response[key].constructor == [].constructor)
                    {
                        response[key] = {};
                    }
                })
                PROJECT_JSON = response;
              //document.getElementById("ProjectArea").style.backgroundImage = `URL(${DefaultPath + response["POSTER"]})`;
            }
        });
    }
}
document.getElementById("ProjectArea").ondragover = (ev)=>{
    ev.preventDefault();
};
document.getElementById("ProjectArea").ondrop = (ev)=>{
    let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
    let Parent = document.getElementById("ProjectArea");
    if(TempChild.parentElement == Parent)
    {
        let ActualX = ev.pageX - ev.dataTransfer.getData("x");
        let ActualY = ev.pageY - ev.dataTransfer.getData("y");
        TempChild.style.top = ActualY + "px";
        TempChild.style.left = ActualX + "px";
        Parent.removeChild(TempChild);
        Parent.appendChild(TempChild);
    }
}
//creates an image add panel which will be added to a image frame 
// add panel will be used to add new images
function GetAddPanel()
{
    let AddPanel = document.createElement("div");
    AddPanel.className = "ImageInsertPanel";
    AddPanel.innerHTML = "CLICK/DROP";
    AddPanel.style.display = "none";
    AddPanel.ondragover = (ev)=>{
        let Obj = document.getElementById(ev.dataTransfer.getData("ChildID"));
        if(Obj.tagName == "IMG")
        {
            ev.preventDefault();
        }
    };
    let AddPanelInput = document.createElement("input");
    AddPanelInput.type = "text";
    AddPanelInput.placeholder = "URL";
    AddPanelInput.onkeydown = (ev) =>
    {
        if(ev.key == "Enter")
        {
            let Img = document.createElement("img");
            Img.src = ev.target.value;
            Img.draggable = true;
            Img.id = (Math.random() + 1).toString(36).substring(7);
            Img.ondragstart = (ev)=>{
                ev.dataTransfer.setData("ChildID",Img.id);
            }
            AddPanel.parentElement.children[2].appendChild(Img);
            PROJECT_JSON["MAGES"][Img.id] = {"path" : Img.src , "path_type" : "URL"};
        }
    }
    AddPanel.onclick = (ev)=>{
        if(ev.target == AddPanel)
        {
            let FileList = document.createElement("input");
            FileList.type = "file";
            FileList.multiple = true;
            FileList.onchange = ()=>{
                //all files should be added to a global file object
                for(let i = 0;i<FileList.files.length;i++)
                {
                    let Img = document.createElement("img");
                    Img.src = URL.createObjectURL(FileList.files[i]);
                    Img.draggable = true;
                    Img.id = (Math.random() + 1).toString(36).substring(7);
                    Img.ondragstart = (ev)=>{
                        ev.dataTransfer.setData("ChildID",Img.id);
                    }
                    ev.target.parentElement.children[2].appendChild(Img);
                    let Obj = {};
                    Obj["path"] = ev.target.parentElement.id + '/' + FileList.files[i].name;
                    Obj["path_type"] = "LOCAL";
                    PROJECT_JSON["IMAGES"][Img.id] = Obj;
                    PROJECT_JSON["IMAGE_FRAMES"][ev.target.parentElement.id]["IMAGE_LIST"][Img.id] = "";
                    Obj = {"blob" : FileList.files[i] , "dest" : Obj["path"]};
                    TempFileS[Img.id] = Obj;
                    setTimeout(()=>{
                        URL.revokeObjectURL(Img.src);
                    },10);
                }
            }
            FileList.click();
      }
    }
    AddPanel.ondrop = (ev) =>{
        let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
        delete PROJECT_JSON["IMAGE_FRAMES"][TempChild.parentElement.parentElement.id]["IMAGE_LIST"][TempChild.id];
        PROJECT_JSON["IMAGE_FRAMES"][ev.target.parentElement.id]["IMAGE_LIST"][TempChild.id] = "";
        TempChild.parentElement.removeChild(TempChild);
        ev.target.parentElement.children[2].appendChild(TempChild)
        if(PROJECT_JSON["IMAGES"][TempChild.id]["path_type"] != "URL")
        {
            let NewPath = ev.target.parentElement.id + '/' + PROJECT_JSON["IMAGES"][TempChild.id]["path"].split('/').reverse()[0];
            console.log(NewPath);
            // checking if it is a temp file ?
            // if so then no need to put it in changes ,instead change the dest url
            // else put it to changes
            if( TempFileS.hasOwnProperty(TempChild.id))
            {
                TempFileS[TempChild.id]["dest"] = NewPath;
            }
            else
            {
                //we have made a change
                if(Changes.hasOwnProperty(TempChild.id))
                {
                    //so if it's already in changes means we don't need to make a change 
                    // on source beacuse source is same in server side
                    Changes[TempChild.id]["dest"] = NewPath;
                }
                else
                {
                    //this is first time we changing so we are adding a new change
                Changes[TempChild.id] = {"source" : PROJECT_JSON["IMAGES"][TempChild.id]["path"],
                                                "dest" : NewPath};
                }
            }
      }
    }
    AddPanel.appendChild(AddPanelInput);
    return AddPanel;
}
//create a new image frame
function CreateImageSection(ID,width = null,height = null , Left , Top)
{
    let MainPanel = document.createElement("div");

    MainPanel.className = "ImagePanel";
    MainPanel.draggable = true;
    MainPanel.ondragstart = (ev)=>{
        if(ev.target.tagName == "DIV")
        {
            ev.dataTransfer.setData("ChildID",ev.target.id);
            ev.dataTransfer.setData("x",ev.layerX);
            ev.dataTransfer.setData("y",ev.layerY);
            setTimeout(()=>{
                ev.target.hidden = true;
            },1)
        }
    };
    MainPanel.ondragend = (ev)=>{
        ev.target.hidden = false;
        console.log(ev.target.style.top);
    }
    MainPanel.id = ID;
    MainPanel.style.left = Left;
    MainPanel.style.top = Top;
    if(width != null)
    {
        MainPanel.style.width = width;
    }
    if(height != null)
    {
        MainPanel.style.height = height;
    }

    let PanelCloseButton = document.createElement("button");
    let PanelAddButton = document.createElement("button");

    PanelCloseButton.innerHTML = "x";
    PanelCloseButton.className = "ImageFrameCloseButton";
    //when the X button will be clicked the frame will be removed including all the images
    PanelCloseButton.onclick = (ev)=>{
        document.getElementById("ProjectArea").removeChild(ev.target.parentElement);
        RemoveImageSection(ID);
    }
    PanelAddButton.className = "ImageFrameAddButton";
    PanelAddButton.innerHTML = "+";
    //when the plus button will be clicked the add panel will be appeared
    PanelAddButton.onclick = (ev)=>{
        let panel = ev.target.parentElement.children[3];
        if(panel.style.display == "none")
        {
            panel.style.display = "flex";
        }
        else
        {
            panel.style.display = "none";
        }
    }
    MainPanel.appendChild(PanelAddButton);
    MainPanel.appendChild(PanelCloseButton);

    let SubPanel = document.createElement("div");
    SubPanel.className = "SubImagePanel";

    MainPanel.appendChild(SubPanel);
    MainPanel.appendChild(GetAddPanel());
    return MainPanel;
}
function CreateVideoItem(ID,width = null,height = null,Left,Top)
{
    let VidPanel = document.createElement("div");
    VidPanel.className = "VideoPanel";
    VidPanel.draggable = true;
    VidPanel.ondragstart = (ev)=>{
      if(ev.target.tagName == "DIV")
      {
          ev.dataTransfer.setData("ChildID",ev.target.id);
          ev.dataTransfer.setData("x",ev.layerX);
          ev.dataTransfer.setData("y",ev.layerY);
          ev.target.style.opacity = 0;
      }
    }
    VidPanel.ondragend = (ev)=>{
        ev.target.style.opacity = 1;
    }
    VidPanel.id = ID;
    VidPanel.style.left = Left
    VidPanel.style.top = Top;
    if(width != null)
    {
        VidPanel.style.width = width;
    }
    if(height != null)
    {
        VidPanel.style.height = height;
    }
    let VidPanelCloseButton = document.createElement("button");
    VidPanelCloseButton.innerHTML = "x";
    VidPanelCloseButton.onclick = (ev) =>{
        ev.target.parentElement.parentElement.removeChild(ev.target.parentElement);
    }
    VidPanel.appendChild(VidPanelCloseButton);
    let VideoObj = document.createElement("video");
    VidPanel.appendChild(VideoObj);
    return VidPanel;
}
//appends new image frame in the project
function AddNewVideoSection()
{
   let ParentItem = document.getElementById("ProjectArea");
   Left = Math.floor(Math.random() * (ParentItem.offsetWidth - (ParentItem.offsetWidth * 30 / 100))) + "px";
   Top = Math.floor(Math.random() * (ParentItem.offsetHeight - (ParentItem.offsetHeight * 40 / 100))) + "px";
   ID = (Math.random() + 1).toString(36).substring(7);
   ParentItem.appendChild(CreateVideoItem(ID,null,null,Left,Top));
}
function RemoveImageSection(ID)
{
   Object.keys(PROJECT_JSON["IMAGE_FRAMES"][ID]["IMAGE_LIST"]).forEach((ky)=>{
    delete PROJECT_JSON["IMAGES"][ky];
    if(TempFileS.hasOwnProperty(ky))
    {
        delete TempFileS[ky];
    }
    if(Changes.hasOwnProperty(ky))
    {
        delete Changes[ky];
    }
   });
   if(NewAdd["FOLDERS"].hasOwnProperty(ID))
   {
       delete NewAdd["FOLDERS"][ID];
   }
   delete PROJECT_JSON["IMAGE_FRAMES"][ID];
}
function AddNewImageSection()
{
   let ParentItem = document.getElementById("ProjectArea");
   Left = Math.floor(Math.random() * (ParentItem.offsetWidth - (ParentItem.offsetWidth * 30 / 100))) + "px";
   Top = Math.floor(Math.random() * (ParentItem.offsetHeight - (ParentItem.offsetHeight * 40 / 100))) + "px";
   ID = (Math.random() + 1).toString(36).substring(7);
   PROJECT_JSON["IMAGE_FRAMES"][ID] = {};
   PROJECT_JSON["IMAGE_FRAMES"][ID]["LEFT"] = Left;
   PROJECT_JSON["IMAGE_FRAMES"][ID]["TOP"] = Top;
   PROJECT_JSON["IMAGE_FRAMES"][ID]["WIDTH"] = null;
   PROJECT_JSON["IMAGE_FRAMES"][ID]["HEIGHT"] = null;
   PROJECT_JSON["IMAGE_FRAMES"][ID]["IMAGE_LIST"] = {};
   NewAdd["FOLDERS"][ID] = "";
   ParentItem.appendChild(CreateImageSection(ID,null,null,Left,Top));
}
function Save()
{
    let PathData = GetPathData();
    if(PathData.hasOwnProperty("code"))
    {
        PerformAjaxRequest("GET",{},
        "../server/greeneditor.php?type=UPDATE_PROJECT&&code=" + PathData["code"] + "&JSON=" + JSON.stringify(PROJECT_JSON)
        ,"",true,(response)=>{
            if((response = JSON.parse(response)).success)
            {
                alert("Saved");
            }
            else
            {
                alert(response.error);
            }
        })
    }
}