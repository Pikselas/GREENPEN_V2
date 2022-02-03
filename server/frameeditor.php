<?php
  include "../references/php/defines.php";
  $Result = ["success" => false , "error" => null]; 
  if(isset($_GET["code"]) && isset($_GET["frameid"]))
  {
    if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
    {
    if($res = mysqli_query($db_conn,sprintf("SELECT AUTHORID FROM GREEN_PROJECTS WHERE CODE = %s" , $_GET["code"])))
        {
            if($res->num_rows > 0)
            {
                $res= $res->fetch_assoc()["AUTHORID"];
                $Result["def_path"] = GP_USER_RESOURCE_ALIAS .'/'.$res.'/'.$_GET["code"];

                $ProjectData = json_decode(file_get_contents($Result["def_path"] . '/' . "GP_SCRIPT.json"),true);
                if(isset($ProjectData["IMAGE_FRAMES"][$_GET["frameid"]]))
                {
                    $Result["success"] = true;
                    foreach($ProjectData["IMAGE_FRAMES"][$_GET["frameid"]]["IMAGE_LIST"] as $ImgID)
                    {
                        $Result[$ImgID] = $ProjectData["IMAGES"][$ImgID];
                    }
                }
                else
                {
                    $Result["error"] = "Frame not Found";
                }
            }
            else
            {
                $Result["error"] = "Invalid code";
            }
        }
    }
    $Result["error"] = "database error";
  }
  else
  {
      $Result["error"] = "project code/frameid is not provided";
  }
  echo json_encode($Result);
?>