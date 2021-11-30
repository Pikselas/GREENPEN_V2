<?php
include "../references/php/defines.php";
 if(isset($_GET["greenuser"]))
 {
     if($db = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
      {
        $SQL = sprintf("SELECT USERNAME,PROFILEPIC FROM GREEN_USERS WHERE USERID = '%s'",$_GET["greenuser"]);
        if($res = mysqli_query($db,$SQL))
        {
            $res = $res->fetch_assoc();
            $res["PROFILEPIC"] = GP_USER_RESOURCE_PATH . '/' . $res["PROFILEPIC"];
            echo json_encode($res);
        }
      }
      else
      {
          echo "{}";
      }
 }
 else if(isset($_FILES["ProfileImage"]))
 {
     if(isset($_COOKIE["active_user_id"]))
     {
        $ExtName = explode('.',$_FILES["ProfileImage"]["name"]);
        $ExtName = array_reverse($ExtName)[0];
        $ModifiedFileName = $_COOKIE["active_user_id"] . "/ProfilePic" . '.' . $ExtName;
        if($db = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
        {
            $SQL = sprintf("UPDATE GREEN_USERS SET PROFILEPIC = '%s' WHERE USERNAME = '%s'",$ModifiedFileName,$_COOKIE["active_user_name"]);
            if(mysqli_query($db,$SQL))
            {
                $ModifiedFileName = GP_USER_RESOURCE_PATH . '/' . $ModifiedFileName;
                move_uploaded_file($_FILES["ProfileImage"]["tmp_name"],$ModifiedFileName);
                setcookie("active_user_profile_pic",GP_USER_RESOURCE_PATH.'/'.$ModifiedFileName ,0,"/","",true);
                echo "true";
            }
        }
     }
 }
 else
 {
     echo "{}";
 }
?>