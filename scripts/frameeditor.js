var PROJECT_JSON = {};
var ImgList = [];
var FRAME_ID = "";
var ActiveImgIndex =  null;
var CurrentPercentage = 50;
var ScrollIntervalHandler = null;

var SlideShowHandler = null;

var SlideShowActive = false;

var SlideShowScroll = true;
var SlideShowInterval = 1000;
var SlideShowNextActive = false;
var SlideShowPrevActive = false;

document.body.onload = ()=>{
    let projdtls = GetPathData();
    if(projdtls.hasOwnProperty("frameid") && projdtls.hasOwnProperty("code"))
    {
        FRAME_ID = projdtls["frameid"];
        PerformAjaxRequest("GET",{} , `../server/frameeditor.php?code=${projdtls["code"]}&&frameid=${projdtls["frameid"]}`,"",true,(res)=>{
            console.log(res);
        });
    }
    // if(PROJECT_JSON["IMAGE_FRAMES"].hasOwnProperty(FRAME_ID))
    // {
    //     ImgList = Object.keys(PROJECT_JSON["IMAGE_FRAMES"][FRAME_ID]["IMAGE_LIST"]);
    //     if(ImgList.length > 0)
    //     {
    //         ActiveImgIndex = 0;
    //     }
    // }
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
        document.getElementById("MainSection").children[0].scrollTo({top : 0});
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
 * @param {number} ScrollPass
 * @param {number} CompleteIn 
 * 
 */
function AutoScroll(ScrollPass , CompleteIn = 100)
{
    let scroller = document.getElementById("MainSection").children[0];
    let SegmentScrollInterval = 1             // Scrolling to the next segment will be done after this ms
    CompleteIn /= ScrollPass;                // divides the time if we have to scroll "ScrollPass" times in given time for per pass calculation 
    let ScrollByPerCall = Math.round(scroller.scrollTopMax * SegmentScrollInterval / CompleteIn);       //calculates segmentSize 
    if(ScrollByPerCall <= 0 && scroller.scrollTopMax != 0 )
    {
        ScrollByPerCall = 1;                      //scroll if segment size is 0 but Scroll size is not 0
    } 
    let prms = new Promise((rlv , rej)=>{
        let CompleteTime = 0;

        let LastPos = scroller.scrollTop;

        ScrollIntervalHandler = setInterval(()=>{
            scroller.scrollBy({top:ScrollByPerCall}) 
            if(LastPos == scroller.scrollTop)
            {
                ScrollByPerCall = -ScrollByPerCall;
                ScrollDest = scroller.scrollTop;
                if( --ScrollPass <= 0)
                {
                    rlv(CompleteTime);
                }
            }
            //console.log(ScrollDest , scroller.scrollTop , ScrollByPerCall , CompleteIn , CompleteTime);
            CompleteTime += SegmentScrollInterval;
            LastPos = scroller.scrollTop;
        } , SegmentScrollInterval);
    });
    return prms;
}
function StopAutoScroll()
{
    clearInterval(ScrollIntervalHandler);
    ScrollIntervalHandler = null;
}
function ShowInFullScreen()
{
    EnterFullScreen(document.getElementById("MainSection"));
}
function SlideShow(callFunction , autoScroll , time_interval , ScrollPass = 1)
{
    SlideShowActive = true;
    if(!autoScroll)
    {
        SlideShowHandler = setInterval(() => {
          callFunction();
          if(!SlideShowActive)
          {
              clearInterval(SlideShowHandler);
          }
        } , time_interval);  
    }
    else
    {
        StopAutoScroll();
        let RecursiveCaller = ()=>{
            if(SlideShowActive)
            {
                AutoScroll(ScrollPass , time_interval).then((rlv)=>{
                    StopAutoScroll();
                    if(rlv < time_interval)
                    {
                        setTimeout(()=>{
                        callFunction();
                        RecursiveCaller();
                        } , time_interval - rlv);
                    }
                    else
                    {
                        callFunction();
                        RecursiveCaller();
                    }
                });
         }
        };
        RecursiveCaller();
    }
}
function StopSlideShow()
{
   SlideShowActive = false;

   //this is necessary for cases where 
   //We call AutoScroll again before previous 
   //interval completed so the the flag becomes true
   clearInterval(SlideShowHandler);
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

document.getElementById("SlideShowPrev").onclick = (ev)=>{
    if(SlideShowPrevActive)
    {
        ev.target.innerHTML = "<";
        SlideShowPrevActive = false;
        StopSlideShow();
    }
    else
    {
        if(SlideShowNextActive)
        {
            StopSlideShow();
            document.getElementById("SlideShowNext").innerHTML = ">";
            SlideShowNextActive = false;
        }
        SlideShowPrevActive = true;
        ev.target.innerHTML = "||";
        SlideShow(PrevImage , SlideShowScroll , SlideShowInterval);
    }
};

document.getElementById("SlideShowNext").onclick = (ev) => {

    if(SlideShowNextActive)
    {
        ev.target.innerHTML = ">";
        SlideShowNextActive = false;
        StopSlideShow();
    }
    else
    {
        if(SlideShowPrevActive)
        {
            StopSlideShow();
            document.getElementById("SlideShowPrev").innerHTML = "<";
            SlideShowPrevActive = false;
        }
        SlideShowNextActive = true;
        ev.target.innerHTML = "||";
        SlideShow(NextImage , SlideShowScroll , SlideShowInterval);
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