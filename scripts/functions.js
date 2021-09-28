function GetCookie()
{
    let biscuit = document.cookie;
    console.log(biscuit);
    biscuit = biscuit.split(';');
    let biscuit_s = {};
    biscuit.forEach((value)=>{
        value = value.split("=");
        biscuit_s[value[0].trim()] = value[1].trim();
    });
    return biscuit_s;
}