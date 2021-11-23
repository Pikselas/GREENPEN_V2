<?php
include "../references/php/defines.php";
  if(isset($_GET["type"]) && isset($_GET["code"]))
  {
      if($_GET["type"] == "GET_PROJECT")
      {
        $Result = ["success"=>false];
        if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
        {
            if($res = mysqli_query($db_conn,sprintf("SELECT AUTHORID FROM GREEN_PROJECTS WHERE CODE = %s" , $_GET["code"])))
            {
                if($res->num_rows > 0)
                {
                $res= $res->fetch_assoc()["AUTHORID"];
                $Result["success"] = true;
                $Result["def_path"] = GP_USER_RESOURCE_PATH .'/'.$res.'/'.$_GET["code"];
                $Result = array_merge($Result,json_decode(file_get_contents($Result["def_path"]."/GP_SCRIPT.json"),true));
                }
            }
        }
        echo json_encode($Result);
    }
    else if($_GET["type"] == "UPDATE_PROJECT" && isset($_GET["code"]) && isset($_GET["JSON"]))
    { 
      $result = ["success"=>false,"error"=>null];
      if(isset($_COOKIE["active_user_id"]))
      {
        if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
        {
          $sql = sprintf("SELECT AUTHORID FROM GREEN_PROJECTS WHERE EXISTS(SELECT CODE FROM PROJECT_ACCESS WHERE CODE = %s AND USERID = %s) AND CODE = %s", $_GET["code"] , $_COOKIE["active_user_id"],$_GET["code"]);
          if($qRes = mysqli_query($db_conn,$sql))
          {
            if($qRes->num_rows > 0)
            {
              //success
               mysqli_query($db_conn , sprintf("UPDATE GREEN_PROJECTS SET UPDATED = NOW() WHERE CODE = %s",$_GET["code"]));
               $ProjPath = GP_USER_RESOURCE_PATH . '/' . $qRes->fetch_assoc()["AUTHORID"] . '/' . $_GET["code"] . '/GP_SCRIPT.json';
               if(file_exists($ProjPath))
               {
                file_put_contents($ProjPath,$_GET["JSON"]);
                $result["success"] = true;
               }
            }
          }
        }
       if(!$result["success"])
       {
         $result["error"] = mysqli_error($db_conn);
       }
      }
      else
      {
        $result["error"] = "U need to login to Modify this";
      }
      echo json_encode($result);
    }
  }
?>