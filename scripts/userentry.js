function CheckValidPass(str)
{
    const MainStr = str;
    const minLen = 6;
    const regExAlphabets = /([a-z]|[A-Z])/;
    const regExSymbol = /[$%@]/;
    if(MainStr.length < minLen)
    {
        return `Password minimum length should be at least ${minLen}`;
    }
    else if(!regExAlphabets.test(MainStr))
    {
        return "Passwod should contain atleast 1 alphabet";
    }
    else if(!regExSymbol.test(MainStr))
    {
        return "Password should contain atleast 1 special character from @,%,$";
    }
    else
    {
        return true;
    }
}
function GetUserDetails()
{
    const userName = document.getElementById("userNM").value.trim();
    const userPS = document.getElementById("userPS").value.trim();
    if(userName.length != "")
    {
        let res = null;
        if((res = CheckValidPass(userPS)) == true)
        {
            return {"name":userName,"pass":userPS};
        }
        else
        {
            return res;
        }
    }
    else
    {
        return "Username should not be empty";
    }
}
document.body.onload = ()=>{
    if(GetCookie().hasOwnProperty("active_user_name"))
    {
        window.location = "userarea.html";
    }
};
document.getElementById("LogInBtn").onclick = ()=>{
    const UserDtls = GetUserDetails();
    if(typeof UserDtls == "string")
    {
        alert(UserDtls);
    }
    else
    {
        UserDtls["type"] = "login";
        const Dat = CreateFormData(UserDtls);
        PerformAjaxRequest("POST",{},"../server/userentry.php",Dat,true,(response)=>{
            response = JSON.parse(response);
            if(response["success"])
            {
                window.location = "userarea.html";
            }
            else
            {
                alert(response["error"]);
            }
        });
    }
};
document.getElementById("SignUpBtn").onclick = ()=>{
    const UserDtls = GetUserDetails();
    if(typeof UserDtls == "string")
    {
        alert(UserDtls);
    }
    else
    {
        UserDtls["type"] = "signup";
        const Dat = CreateFormData(UserDtls);
        PerformAjaxRequest("POST",{},"../server/userentry.php",Dat,true,(response)=>{
            response = JSON.parse(response);
            if(response["success"])
            {
                window.location = "userarea.html";
            }
            else
            {
                alert(response["error"]);
            }
        });
    }
};