window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
  },false);
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
        TempChild.style.opacity = 1;
    }
}
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
    AddPanel.onclick = (ev)=>{
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
    AddPanel.ondrop = (ev) =>{
        let TempChild = document.getElementById(ev.dataTransfer.getData("ChildID"));
        TempChild.parentElement.removeChild(TempChild);
        ev.target.parentElement.children[2].appendChild(TempChild)
    }
    return AddPanel;
}
function CreateImageSection()
{
    let ParentItem = document.getElementById("ProjectArea");
    let MainPanel = document.createElement("div");
    
    MainPanel.className = "ImagePanel";
    MainPanel.draggable = true;
    MainPanel.ondragstart = (ev)=>{
        if(ev.target.tagName == "DIV")
        {
            ev.dataTransfer.setData("ChildID",ev.target.id);
            ev.dataTransfer.setData("x",ev.layerX);
            ev.dataTransfer.setData("y",ev.layerY);
            ev.target.style.opacity = 0;
        }
    };
    MainPanel.id = (Math.random() + 1).toString(36).substring(7);
    MainPanel.style.left = Math.floor(Math.random() * (ParentItem.offsetWidth - (ParentItem.offsetWidth * 30 / 100))) + "px";
    MainPanel.style.top = Math.floor(Math.random() * (ParentItem.offsetHeight - (ParentItem.offsetHeight * 40 / 100))) + "px";
    
    let PanelCloseButton = document.createElement("button");
    let PanelAddButton = document.createElement("button");
    
    PanelCloseButton.innerHTML = "x";
    PanelCloseButton.className = "ImageFrameCloseButton";
    PanelCloseButton.onclick = (ev)=>{
        document.getElementById("ProjectArea").removeChild(ev.target.parentElement);
    }
    PanelAddButton.className = "ImageFrameAddButton";
    PanelAddButton.innerHTML = "+";
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
    ParentItem.appendChild(MainPanel);
}
function AddImage(ev)
{
    console.log(ev);
}