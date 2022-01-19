var ImgList = [];
var FRAME_ID = "";
var ActiveImgIndex =  null;
var CurrentPercentage = 50;
document.body.onload = ()=>{
    let projdtls = GetPathData();
    if(projdtls.hasOwnProperty("frameid"))
    {
        FRAME_ID = projdtls["frameid"];
    }
    if(PROJECT_JSON["IMAGE_FRAMES"].hasOwnProperty(FRAME_ID))
    {
        ImgList = Object.keys(PROJECT_JSON["IMAGE_FRAMES"][FRAME_ID]["IMAGE_LIST"]);
        if(ImgList.length > 0)
        {
            ActiveImgIndex = 0;
        }
    }
}
setTimeout(()=>{
    let Mainsec = document.getElementById("MainSection").children[0]
    let SelectorSec = document.getElementById("PreviewSection");
    ImgList.forEach((str,indx)=>{
        let ImgSource = PROJECT_JSON["IMAGES"][str]["path_type"] == "URL" ? PROJECT_JSON["IMAGES"][str]["path"] : "///" + PROJECT_JSON["IMAGES"][str]["path"];
        let Img = document.createElement("img");
        Img.src = ImgSource;
        let SelectorImg = document.createElement("img");
        SelectorImg.src = ImgSource;
        let Selector = document.createElement("div");
        Selector.appendChild(SelectorImg);
        Selector.innerHTML += "<br/>" + ImgSource.split("/").reverse()[0];
        Selector.setAttribute("onclick" , `GoToImg(${indx})`);
        if(indx != 0)
        {
            Img.hidden = true;
        } 
        SelectorSec.appendChild(Selector);
        Img.id = str;
        Mainsec.appendChild(Img);           
    });
},1);
function ResizeFrame(sizeInPercent)
{
    if(sizeInPercent <= 100 && sizeInPercent >= 0)
    {
        let Elm = document.getElementById("MainSection")
        Elm.style.width = String(sizeInPercent) + "%"
        Elm.style.left = String((100 - sizeInPercent) / 2) + "%";
    }
}
function AutoResizeHeight()
{
    if(ActiveImgIndex != null)
    {
        let Elm = document.getElementById("MainSection");
        let ActiveImage = document.getElementById(ImgList[ActiveImgIndex]);
        if(ActiveImage.offsetHeight  <= document.documentElement.scrollHeight)
        {
            Elm.style.height = String((ActiveImage.offsetHeight + 25)) + "px";
        }
        else if(Elm.offsetHeight < document.documentElement.scrollHeight)
        {
            Elm.style.height = "100%";
        }

    }
}
function IncreaseSize()
{
    CurrentPercentage += 10;
    if(CurrentPercentage > 100)
    {
        CurrentPercentage = 100;
    }
    ResizeFrame(CurrentPercentage);
}
function DecreaseSize()
{
    CurrentPercentage -= 10;
    if(CurrentPercentage < 0)
    {
        CurrentPercentage = 0;
    }
    ResizeFrame(CurrentPercentage);
}
function ShowImage(ImgIndx)
{
    document.getElementById(ImgList[ImgIndx]).hidden = false;
}
function HideImage(ImgIndx)
{
    document.getElementById(ImgList[ImgIndx]).hidden = true;
}
function GoToImg(ImgIndx)
{

    if(ActiveImgIndex != null)
    {
        HideImage(ActiveImgIndex);
        ShowImage(ImgIndx);
        ActiveImgIndex = ImgIndx;
    }
}
function NextImage()
{
   GoToImg(ActiveImgIndex + 1 == ImgList.length ? 0 : ActiveImgIndex + 1);
}
function PrevImage()
{
    GoToImg(ActiveImgIndex - 1 == -1 ? ImgList.length - 1 : ActiveImgIndex - 1);
}
document.getElementById("ExpandButton").onclick = (ev)=>{
    if(ev.target.parentElement.style.height == "45px")
    {
        ev.target.parentElement.style.height = "95%"
        ev.target.style.transform = "rotate(180deg)";
        ev.target.parentElement.children[1].hidden = false;
    }
    else
    {
        ev.target.parentElement.style.height = "45px";
        ev.target.style.transform = "";
        ev.target.parentElement.children[1].hidden = true;
    }
};
document.onkeydown = (e)=>{
    if(e.key == "w")
    {
        AutoResizeHeight();
    }
    else if(e.key == "a")
    {
        IncreaseSize();
    }
    else if(e.key == "s")
    {
        DecreaseSize();
    }
    else if(e.key == "ArrowLeft")
    {
        PrevImage();
    }
    else if(e.key == "ArrowRight")
    {
        NextImage();
    }
    else if(e.key == "ArrowDown")
    {
        console.log(e);
        let scroller = document.getElementById("MainSection").children[0];
        let scrollingBy = 20;
        let ScrollDest = scroller.scrollTopMax;
        let itrval = setInterval(()=>{
            scroller.scrollBy({top:scrollingBy , "behavior" : "smooth"});
            if(scroller.scrollTop == ScrollDest)
            {
                scrollingBy = -scrollingBy;
                ScrollDest = scroller.scrollTopMax - scroller.scrollTop;
            }
        })
    }
}