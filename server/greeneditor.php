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
  }
?>