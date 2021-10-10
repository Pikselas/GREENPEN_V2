<?php
include "../references/php/defines.php";
  if(isset($_GET["action"]) && isset($_COOKIE["active_user_id"]))
  {
      if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
      {
      switch($_GET["action"])
      {
          case "NEW_PROJECT":
            $result = array("success"=>false,"projectcode"=>null);
             if(isset($_GET["project_name"]))
             {
                 $SQL = sprintf("INSERT INTO GREEN_PROJECTS (NAME,AUTHORID,POSTER) VALUES ('%s',%s,'%s')",$_GET["project_name"],$_COOKIE["active_user_id"],GP_USER_DEFAULT_PROJECT_POSTER);
                 if(mysqli_query($db_conn,$SQL))
                 {
                    $code = mysqli_query($db_conn,"SELECT LAST_INSERT_ID() AS CODE FROM GREEN_PROJECTS")->fetch_assoc()["CODE"];
                    $result["success"] = true;
                    $result["projectcode"] = $code;
                 }
                 else
                 {
                     $result["error"] = mysqli_error($db_conn);
                 }
             }
             else
             {
                 $result["error"] = "project name not provided";
             }
             echo json_encode($result);
            break;
      }
      }   
  }
?>