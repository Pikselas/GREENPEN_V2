var PROJECT_JSON = {};
var DefaultPath = "";
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
                }
            }
            FileList.click();
      }
    }
    AddPanel.ondrop = (ev) =>{
        let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
        TempChild.parentElement.removeChild(TempChild);
        ev.target.parentElement.children[2].appendChild(TempChild)
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
function AddNewImageSection()
{
   let ParentItem = document.getElementById("ProjectArea");
   Left = Math.floor(Math.random() * (ParentItem.offsetWidth - (ParentItem.offsetWidth * 30 / 100))) + "px";
   Top = Math.floor(Math.random() * (ParentItem.offsetHeight - (ParentItem.offsetHeight * 40 / 100))) + "px";
   ID = (Math.random() + 1).toString(36).substring(7);
   PROJECT_JSON["IMAGES"][ID] = {};
   PROJECT_JSON["IMAGES"][ID]["LEFT"] = Left;
   PROJECT_JSON["IMAGES"][ID]["TOP"] = Top;
   PROJECT_JSON["IMAGES"][ID]["WIDTH"] = null;
   PROJECT_JSON["IMAGES"][ID]["HEIGHT"] = null;
   PROJECT_JSON["IMAGES"][ID]["IMAGE_LIST"] = [];
   ParentItem.appendChild(CreateImageSection(ID,null,null,Left,Top));
}