function GetCookie()
{
    let biscuit = document.cookie;
    biscuit = biscuit.split(';');
    let biscuit_s = {};
    biscuit.forEach((value)=>{
        value = value.split("=");
        if(value.length > 1)
        {
            biscuit_s[value[0].trim()] = value[1].trim();
        }
    });
    return biscuit_s;
}
function LogOut()
{
    PerformAjaxRequest("GET",{},"../server/logout.php","",true,()=>{
        window.location = "home.html";
    });
}
function CreateFormData(obj)
{
    const Frm = new FormData();
    Object.keys(obj).forEach((key)=>{
        Frm.append(key,obj[key]);
    });
    return Frm;
}
/**
 * 
 * @param {string} type - GET / POST
 * @param {object} headers
 * @param {string} Url 
 * @param {any} RequestBody 
 * @param {boolean} asyncronous 
 * @param {function} callingFunction 
 */
function PerformAjaxRequest(
    type , 
    headers,
    Url,
     RequestBody,
     asyncronous = true,callingFunction = null)
{

let AjxReq = new XMLHttpRequest();
AjxReq.onreadystatechange = ()=>{
if(AjxReq.readyState == 4 && AjxReq.status == 200)
{
    if(callingFunction != null)
    {
        callingFunction(AjxReq.response);
    }
}
}
AjxReq.open(type,Url,asyncronous);
Object.keys(headers).forEach((key)=>{
    AjxReq.setRequestHeader(key,headers[key]);
    })
AjxReq.send(RequestBody);
}
function GetPathData()
{
    let ResultJson = {};
    let SuppliedVal = window.location.search.replace('?','').replaceAll("%20","");
    SuppliedVal = SuppliedVal.split("&");
    SuppliedVal.forEach((value)=>{
        let Tmp = value.split('=');
        if(Tmp.length < 2)
        {
            if(Tmp[0] != '')
            {
                ResultJson[Tmp[0]] = null;
            }
        } 
        else
        {
            ResultJson[Tmp[0]] = Tmp[1];
        }
    })
    return ResultJson;
}
function EnterFullScreen(elem)
{
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
}