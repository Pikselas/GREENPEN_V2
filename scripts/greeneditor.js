var PROJECT_JSON = {};
var DefaultPath = "";
var NewAdd = {"FOLDERS" : {}};
var Deleted = {"FOLDERS" : [] , "FILES" : []};
var Changes = {} ; // { ID1 : {"source" : "","dest":"" },ID2 : {"source" : "","dest":"" }}
var TempFileS = {}; // {ID : {blob : "",dest : "real_path"}}
var NewlyAddedTags = {};
var RemovedTags = {};

var ImgSubPanelIndx = 3;
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
                
                let ImageSetter = ()=>{Object.keys(PROJECT_JSON["IMAGE_FRAMES"]).forEach((k)=>{
                    if(PROJECT_JSON["IMAGE_FRAMES"][k]["IMAGE_LIST"].constructor == [].constructor)
                    {
                        PROJECT_JSON["IMAGE_FRAMES"][k]["IMAGE_LIST"] = {};
                    }
                    setTimeout(SetUpFrames,1,k);});};
                setTimeout(ImageSetter , 1);
                setTimeout(() => {
                    Object.keys(PROJECT_JSON["VIDEOS"]).forEach(SetUpVideos);
                }, 1);
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
function SetUpVideos(ID)
{
    let RealPath = (PROJECT_JSON["VIDEOS"][ID]["PATH_TYPE"] == "URL" ? PROJECT_JSON["VIDEOS"][ID]["PATH"] : DefaultPath + '/' + PROJECT_JSON["VIDEOS"][ID]["PATH"]);
    document.getElementById("ProjectArea").appendChild(CreateVideoItem(ID , PROJECT_JSON["VIDEOS"][ID]["WIDTH"],
    PROJECT_JSON["VIDEOS"][ID]["HEIGHT"],PROJECT_JSON["VIDEOS"][ID]["LEFT"],PROJECT_JSON["VIDEOS"][ID]["TOP"],RealPath));
}
function SetUpFrames(FrameID)
{
    let Area = document.getElementById("ProjectArea");
    let ObjDtls = PROJECT_JSON["IMAGE_FRAMES"][FrameID];
    let Frame = CreateImageSection(FrameID,ObjDtls["WIDTH"],ObjDtls["HEIGHT"],ObjDtls["LEFT"],ObjDtls["TOP"]);
    Object.keys(ObjDtls["IMAGE_LIST"]).forEach((ky)=>{
        let ImgDtls = PROJECT_JSON["IMAGES"][ky];
        let Img = document.createElement("img");
        Img.src = (ImgDtls["path_type"] == "URL" ? ImgDtls["path"] : DefaultPath + '/' + ImgDtls["path"]);
        Img.draggable = true;
        Img.id = ky;
        Img.ondragstart = (ev)=>{
            ev.dataTransfer.setData("ChildID",Img.id);
        }
        Frame.children[ImgSubPanelIndx].appendChild(Img);
    });
    Area.appendChild(Frame);
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
            AddPanel.parentElement.children[ImgSubPanelIndx].appendChild(Img);
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
                    ev.target.parentElement.children[ImgSubPanelIndx].appendChild(Img);
                    let Obj = {};
                    Obj["path"] = ev.target.parentElement.id + '/' + FileList.files[i].name;
                    Obj["path_type"] = "LOCAL";
                    Obj["tags"] = [];
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
        ev.target.parentElement.children[ImgSubPanelIndx].appendChild(TempChild)
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
            PROJECT_JSON["IMAGES"][TempChild.id]["path"] = NewPath;
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
        PROJECT_JSON["IMAGE_FRAMES"][MainPanel.id]["TOP"] = MainPanel.style.top;
        PROJECT_JSON["IMAGE_FRAMES"][MainPanel.id]["LEFT"] = MainPanel.style.left;
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
    let PanelOpenButton = document.createElement("button");

    PanelCloseButton.innerHTML = "x";
    PanelCloseButton.className = "ImageFrameCloseButton";
    //when the X button will be clicked the frame will be removed including all the images
    PanelCloseButton.onclick = (ev)=>{
        RemoveImageSection(ID);
        document.getElementById("ProjectArea").removeChild(ev.target.parentElement);
    }
    PanelAddButton.className = "ImageFrameAddButton";
    PanelAddButton.innerHTML = "+";
    //when the plus button will be clicked the add panel will be appeared
    PanelAddButton.onclick = (ev)=>{
        let panel = ev.target.parentElement.children[ImgSubPanelIndx + 1];
        if(panel.style.display == "none")
        {
            panel.style.display = "flex";
        }
        else
        {
            panel.style.display = "none";
        }
    }

    PanelOpenButton.innerHTML = ":-:";
    PanelOpenButton.className = "ImageFrameOpenButton";
    PanelOpenButton.onclick = (ev)=>{
            window.open(`frameeditor.html?frameid=${ev.target.parentElement.id}&&code=${GetPathData()["code"]}`);
    };

    MainPanel.appendChild(PanelOpenButton);
    MainPanel.appendChild(PanelAddButton);
    MainPanel.appendChild(PanelCloseButton);

    let SubPanel = document.createElement("div");
    SubPanel.className = "SubImagePanel";

    MainPanel.appendChild(SubPanel);
    MainPanel.appendChild(GetAddPanel());
    return MainPanel;
}
function CreateVideoItem(ID,width = null,height = null,Left,Top,Source)
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
          setTimeout(()=>{
            ev.target.hidden = true;
        },1)
      }
    }
    VidPanel.ondragend = (ev)=>{
        PROJECT_JSON["VIDEOS"][VidPanel.id]["TOP"] = VidPanel.style.top;
        PROJECT_JSON["VIDEOS"][VidPanel.id]["LEFT"] = VidPanel.style.left;
        ev.target.hidden = false;
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
        let vidID = ev.target.parentElement.id;
        if(TempFileS.hasOwnProperty(vidID))
        {
            delete TempFileS[vidID];
        }
        else
        {
            if(PROJECT_JSON["VIDEOS"][vidID]["PATH_TYPE"] == "LOCAL")
            {
             Deleted["FILES"].push(PROJECT_JSON["VIDEOS"][vidID]["PATH"]);
            }
        }
        delete PROJECT_JSON["VIDEOS"][vidID];
        //let SyncData = PROJECT_JSON["SYNC_IMV"][ID];
    }
    VidPanel.appendChild(VidPanelCloseButton);
    let VideoObj = document.createElement("video");
    VideoObj.src = Source;
    VideoObj.controls = true;
    VidPanel.appendChild(VideoObj);
    return VidPanel;
}
function AddNewVideoSection()
{
   let Url = prompt("ENTER LOCAL / URL","LOCAL");
   let TempFile = null;
   if(Url != null)
   {
    let ParentItem = document.getElementById("ProjectArea");
    let Left = Math.floor(Math.random() * (ParentItem.offsetWidth - (ParentItem.offsetWidth * 30 / 100))) + "px";
    let Top = Math.floor(Math.random() * (ParentItem.offsetHeight - (ParentItem.offsetHeight * 40 / 100))) + "px";
    let ID = (Math.random() + 1).toString(36).substring(7);
    if(Url == "LOCAL")
    {
        let TempFileSelector = document.createElement("input");
        TempFileSelector.type = "file";
        TempFileSelector.accept = "video/*";
        TempFileSelector.onchange = ()=>{
             TempFile = TempFileSelector.files[0];
             Url = URL.createObjectURL(TempFile);
             let FinalPath = "videos/" + TempFile["name"];
             TempFileS[ID] = {"blob" : TempFile , "dest" : FinalPath};
             PROJECT_JSON["VIDEOS"][ID] = {"PATH" : FinalPath ,"PATH_TYPE" : "LOCAL" , "TOP" : Top , "LEFT" : Left , "HEIGHT" : null , "WIDTH" : null};
             ParentItem.appendChild(CreateVideoItem(ID,null,null,Left,Top,Url));
             setTimeout(()=>{
                 URL.revokeObjectURL(Url);
             },10);
        };
        TempFileSelector.click();
    }
    else
    {
        PROJECT_JSON["VIDEOS"][ID] = {"PATH" : Url ,"PATH_TYPE" : "URL" , "TOP" : Top , "LEFT" : Left , "HEIGHT" : null , "WIDTH" : null};
        ParentItem.appendChild(CreateVideoItem(ID,null,null,Left,Top,Url));
    }
   }
}
function RemoveImage(ID)
{
    let ImagePath = PROJECT_JSON["IMAGES"][ID]["path"];
    PROJECT_JSON["IMAGES"][ID]["tags"].forEach((tagname)=>{
        delete PROJECT_JSON["TAGS"][tagname]["IMAGES"][ID];
    });
    delete PROJECT_JSON["IMAGES"][ID];
    if(TempFileS.hasOwnProperty(ID))
    {
        delete TempFileS[ID];
    }
    else
    {
        Deleted["FILES"].push(ImagePath);
    }
    if(Changes.hasOwnProperty(ID))
    {
        delete Changes[ID];
    }
    let elm = document.getElementById(ID);
    delete PROJECT_JSON["IMAGE_FRAMES"][elm.parentElement.parentElement.id]["IMAGE_LIST"][ID];
    elm.parentElement.removeChild(elm);
}
function RemoveImageSection(ID)
{
    Object.keys(PROJECT_JSON["IMAGE_FRAMES"][ID]["IMAGE_LIST"]).forEach((ky)=>{
    RemoveImage(ky);
   });
   if(NewAdd["FOLDERS"].hasOwnProperty(ID))
   {
       delete NewAdd["FOLDERS"][ID];
   }
   else
   {
     Deleted["FOLDERS"].push(ID);
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

function CreateContextPanel(func = (pan)=>{})
{
    let Panel = document.createElement("div");
    Panel.className = "ContextPanel";
    document.body.onclick = (ev)=>{
        if(ev.target != Panel && !Panel.contains(ev.target))
        {
            document.body.removeChild(Panel);
            document.body.onclick = null;
        }
    }

    func(Panel);

    document.body.appendChild(Panel);
}

function CreateTagPanel()
{
    let panel = document.createElement("div");
    let panleImgSection = document.createElement("div");
    let panelVideoSection = document.createElement("div");
    
    panel.className = "TagSection";
    panleImgSection.className = "TaggedImageSection";
    panelVideoSection.className = "TaggedVideoSection";

    panel.appendChild(panleImgSection);
    panel.appendChild(panelVideoSection);

    return panel;
    
}

function RemoveEmptyTags()
{
    Object.keys(PROJECT_JSON["TAGS"]).forEach((tagname)=>{
        if(Object.keys(PROJECT_JSON["TAGS"][tagname]["IMAGES"]).length == 0 
                    && 
           Object.keys(PROJECT_JSON["TAGS"][tagname]["VIDEOS"]).length == 0)
        {
            if(NewlyAddedTags.hasOwnProperty(tagname))
            {
              delete NewlyAddedTags[tagname];  
            }
            else
            {
                RemovedTags[tagname] = "";
            }
            delete PROJECT_JSON["TAGS"][tagname];
        }
    });
}

function Save()
{
  let PathData = GetPathData();
  if(PathData.hasOwnProperty("code"))
  {
      RemoveEmptyTags();
      let TmpFLDests = [];
      let FrmDT = CreateFormData({"JSON" : JSON.stringify(PROJECT_JSON),"CHANGES" : JSON.stringify(Changes) ,
                                 "NEW_ADD" : JSON.stringify(NewAdd) ,"DELETED" : JSON.stringify(Deleted)});
      Object.keys(TempFileS).forEach((ky)=>{
        TmpFLDests.push(TempFileS[ky]["dest"]);
        FrmDT.append("TempFiles[]" , TempFileS[ky]["blob"]);
      });
      FrmDT.append("TempFilePaths",JSON.stringify(TmpFLDests));
      PerformAjaxRequest("POST" ,{},"../server/greeneditor.php?type=UPDATE_PROJECT&&code=" + PathData["code"],FrmDT,true,(response)=>{
          console.log(response);
        response = JSON.parse(response);
        if(response.success)
        {
            NewAdd = {"FOLDERS" : {}};
            Deleted = {"FOLDERS" : [] , "FILES" : []};
            Changes = {} ;
            TempFileS = {};
            NewlyAddedTags = {};
            RemovedTags = {};
            alert("saved");
        }
        else
        {
            alert(response.error);
        }
      });
  }
}

// horizontal scrolling
document.getElementById("TagDetails").addEventListener("wheel",(ev)=>{
    document.getElementById("TagDetails").scrollBy({left: ev.deltaY > 0 ? 10 : -10});
})
// customized context menu

document.body.oncontextmenu = (ev)=>
{
    ev.preventDefault();
    document.body.click();
    switch(ev.target.nodeName)
    {
        case "IMG":
            if(ev.target.parentElement.className == "SubImagePanel")
            {
                CreateContextPanel((panel) =>{
                    panel.style.top = String(ev.clientY) + "px";
                    panel.style.left = String(ev.clientX) + "px";
                    let AddTagBut1 = document.createElement("div");
                    let DelBut = document.createElement("div");
                    AddTagBut1.innerHTML = "ADD TAG";
                    DelBut.innerHTML = "delete";
                    AddTagBut1.onclick = ()=>{
                        document.body.click();
                        if((Etag = prompt("ENTER TAG NAME:")) != null)
                        {
                            if(Etag == "")
                            {
                                alert("Empty string is not allowed");
                            }
                            else
                            {
                                Etag = Etag.toUpperCase();
                                if(!PROJECT_JSON["TAGS"].hasOwnProperty(Etag))
                                {
                                    PROJECT_JSON["TAGS"][Etag] = {"IMAGES" : {} , "VIDEOS" : {}};
                                    NewlyAddedTags[Etag] = "";
                                    let tagbut = document.createElement("button");
                                    tagbut.innerHTML = Etag;
                                    tagbut.onclick = (ev)=>{
                                        document.body.click();
                                        let panel = CreateTagPanel();
                                        panel.style.left = ev.clientX - 50 + "px";
                                        panel.style.top = ev.clientY - 400 + "px";
                                        Object.keys(PROJECT_JSON["TAGS"][ev.target.innerHTML]["IMAGES"]).forEach((k)=>{
                                            let Idbut = document.createElement("button");
                                            Idbut.innerHTML = k;
                                            Idbut.onclick = ()=>{
                                                document.getElementById(k).scrollIntoView({behavior : "smooth"});
                                            };
                                            panel.children[0].appendChild(Idbut);
                                        });
                                        document.body.appendChild(panel);
                                        document.body.onclick = (ev)=>{
                                        if(ev.target != panel && !panel.contains(ev.target) && ev.target != tagbut)
                                            {
                                                panel.parentElement.removeChild(panel);
                                                document.body.onclick = null;
                                            }
                                        };
                                    }
                                    document.getElementById("TagDetails").appendChild(tagbut);
                                }
                                if(!PROJECT_JSON["TAGS"][Etag].hasOwnProperty(ev.target.id))
                                {
                                    PROJECT_JSON["IMAGES"][ev.target.id]["tags"].push(Etag);
                                }
                                PROJECT_JSON["TAGS"][Etag]["IMAGES"][ev.target.id] = "";
                                
                            }
                        }
                    };
                    DelBut.onclick = ()=>{
                        RemoveImage(ev.target.id);
                        document.body.click();
                    };
                    panel.appendChild(AddTagBut1);

                    PROJECT_JSON["IMAGES"][ev.target.id]["tags"].forEach((tagname)=>{
                        let DelTagBut = document.createElement("div");
                        DelTagBut.innerHTML = "remove " + tagname;
                        DelTagBut.onclick = ()=>{
                            document.body.click();
                            let tagIndx = PROJECT_JSON["IMAGES"][ev.target.id]["tags"].indexOf(tagname);
                            PROJECT_JSON["IMAGES"][ev.target.id]["tags"].splice(tagIndx , 1);
                            delete PROJECT_JSON["TAGS"][tagname]["IMAGES"][ev.target.id];
                        }
                        panel.appendChild(DelTagBut);
                    });

                    panel.appendChild(DelBut);
                });
            }
            break;
        case "VIDEO":
            console.log("vid");
            break;
    }
}