var ImgList = [];
var FRAME_ID = "";
var ActiveImgIndex =  null;
var CurrentPercentage = 50;
var ScrollIntervalHandler = null;
var ScrollByPerCall = 20;
var LastScrollPass = 2;
var LastScrollDuration = 100;

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
        if(ScrollIntervalHandler != null)
        {
            StopAutoScroll();
            //AutoScroll(LastScrollPass);
        }
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
        if(ScrollIntervalHandler != null)
        {
            StopAutoScroll();
            setTimeout(AutoScroll,500 , LastScrollPass);
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
        document.getElementById("MainSection").children[0].scrollTo({top : 0});
    }
    if(ScrollIntervalHandler != null)
   {
       StopAutoScroll();
       AutoScroll(LastScrollPass);
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
/**
 * @param {Function} CallableFunc
 * 
 */
function AutoScroll(ScrollPass , CompleteIn = 100)
{
    LastScrollPass = ScrollPass;
    let scroller = document.getElementById("MainSection").children[0];
    let ScrollDest = scroller.scrollTopMax;
    ScrollByPerCall = Math.round(scroller.scrollTopMax / CompleteIn);
    if(ScrollByPerCall <= 0 && scroller.scrollTopMax != 0 )
    {
        ScrollByPerCall = 1;
    } 
    let prms = new Promise((rlv , rej)=>{
        ScrollIntervalHandler = setInterval(()=>{
            if(scroller.scrollTop == ScrollDest)
            {
                ScrollByPerCall = -ScrollByPerCall;
                ScrollDest = scroller.scrollTopMax - scroller.scrollTop;
                if( --ScrollPass <= 0)
                {
                    rlv("Ok");
                }
            }
            scroller.scrollBy({top:ScrollByPerCall});
        } , 1);
    });
    return prms;
}
function StopAutoScroll()
{
    clearInterval(ScrollIntervalHandler);
    ScrollIntervalHandler = null;
    ScrollByPerCall = ScrollByPerCall < 0 ? -ScrollByPerCall : ScrollByPerCall;
}
function ShowInFullScreen()
{
    EnterFullScreen(document.getElementById("MainSection"));
}
document.getElementById("ExpandButton").onclick = (ev)=>{
    if(ev.target.parentElement.parentElement.style.height == "45px")
    {
        ev.target.parentElement.parentElement.style.height = "95%"
        ev.target.style.transform = "rotate(180deg)";
        document.getElementById("PreviewSection").hidden = false;
    }
    else
    {
        ev.target.parentElement.parentElement.style.height = "45px";
        ev.target.style.transform = "";
        document.getElementById("PreviewSection").hidden = true;
    }
};
document.onkeydown = (e)=>{
    switch(e.key)
    {
        case "ArrowLeft":
            PrevImage();
            break;
        case "ArrowRight":
            NextImage();
            break;
        case "ArrowDown":
            AutoScroll(2);
            break;
        case "w":
        case "W":
            IncreaseSize();
            break;
        case "s":
        case "S":
            DecreaseSize();
            break;
        case "a":
        case "A":
            AutoResizeHeight();
            break;
        case "f":
            ShowInFullScreen();
            break;
    }

}