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
                 $SQL = sprintf("INSERT INTO GREEN_PROJECTS (NAME,AUTHORID,POSTER,UPDATED) VALUES ('%s',%s,'%s',NOW())",$_GET["project_name"],$_COOKIE["active_user_id"],GP_USER_DEFAULT_PROJECT_POSTER);
                 if(mysqli_query($db_conn,$SQL))
                 {
                    $code = mysqli_query($db_conn,"SELECT LAST_INSERT_ID() AS CODE FROM GREEN_PROJECTS")->fetch_assoc()["CODE"];
                    $result["success"] = true;
                    $result["projectcode"] = $code;
                    $PrjJson = json_decode(file_get_contents("../references/json/scriptskeleton.json"),true);
                    $PrjJson["NAME"] = $_GET["project_name"];
                    $PrjJson["POSTER"] = "../../../" . GP_USER_DEFAULT_PROJECT_POSTER;
                    mkdir(GP_USER_RESOURCE_PATH . '/' . $_COOKIE["active_user_id"] .'/'.$code);
                    mkdir(GP_USER_RESOURCE_PATH . '/' . $_COOKIE["active_user_id"] .'/'.$code . '/videos');
                    file_put_contents(GP_USER_RESOURCE_PATH . '/' . $_COOKIE["active_user_id"] . '/' . $code . "/GP_SCRIPT.json",json_encode($PrjJson,JSON_PRETTY_PRINT));
                    mysqli_query($db_conn,sprintf("INSERT INTO PROJECT_ACCESS VALUES(%s,%s)",$code,$_COOKIE["active_user_id"]));
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
         case "GET_PROJECTS":
                $SQL = sprintf("SELECT CODE,NAME,POSTER,UPDATED FROM GREEN_PROJECTS WHERE AUTHORID = %s ORDER BY UPDATED DESC",$_COOKIE["active_user_id"]);
                if($res = mysqli_query($db_conn,$SQL))
                {
                    $Response = array();
                    while($res1 = $res->fetch_assoc())
                    {
                        $res1["POSTER"] = GP_USER_RESOURCE_ALIAS . '/' . $res1["POSTER"];
                        array_push($Response,$res1);
                    }
                    echo json_encode($Response);
                }
                else
                {
                    echo "[]";
                }
            break;
        case "SEARCH":
            if(isset($_GET["query"]))
            {
                $SQL = "";
                if(strpos($_GET["query"] , ";"))
                {
                    /*
                      queries like -> "TAG : bmw , bike ; NAME : car , ktm"
                                    comma -> projects that contains all the comma seperated tags/names
                                    semicolons -> Intersects all the tables
                    */
                    $qr_ar = explode(';' , $_GET["query"]);
                    $SQL = "SELECT GREEN_PROJECTS.CODE , NAME , POSTER FROM GREEN_PROJECTS";
                    foreach($qr_ar as $part)
                    {
                        if($colPos = strpos($part , ':'))
                        {
                         $srType = strtoupper(trim(substr($part , 0 , $colPos)));
                         $elmlist = explode(',' , substr($part , $colPos + 1));
                         switch($srType)
                         {
                             case "TAG":
                                foreach($elmlist as $tag)
                                {
                                 $tag = trim($tag);
                                 $SQL .= sprintf(" INNER JOIN (SELECT GREEN_TAGS.PROJECT_CODE FROM GREEN_TAGS WHERE TAG LIKE '%%%s%%') %s ON GREEN_PROJECTS.CODE = %s.PROJECT_CODE", $tag , $tag , $tag);
                                }
                                break;
                             case "NAME":
                                foreach($elmlist as $name)
                                {
                                    $name = trim($name);
                                    $SQL .= sprintf(" INNER JOIN (SELECT GREEN_PROJECTS.CODE FROM GREEN_PROJECTS WHERE NAME LIKE '%%%s%%') %s ON GREEN_PROJECTS.CODE = %s.CODE",$name , $name , $name );
                                }
                                break; 
                         }
                        }
                    }
                }
                else
                {
                    //normal entry -> searches for all the names and tags that matches
                    $SQL = sprintf("SELECT CODE ,NAME , POSTER FROM GREEN_PROJECTS WHERE NAME LIKE '%%%s%%' UNION SELECT CODE , NAME , POSTER FROM GREEN_PROJECTS INNER JOIN (SELECT PROJECT_CODE FROM GREEN_TAGS WHERE TAG LIKE '%%%s%%') T ON GREEN_PROJECTS.CODE = T.PROJECT_CODE"  , $_GET["query"] , $_GET["query"]);
                }
                if($res = mysqli_query($db_conn , $SQL))
                {
                    $RESULT = [];
                    while($arr = $res->fetch_assoc())
                    {
                        $arr["POSTER"] = GP_USER_RESOURCE_ALIAS . '/' . $arr["POSTER"];
                        array_push($RESULT , $arr);
                    }
                    echo json_encode($RESULT);
                }
                else
                {
                    echo "[]";
                }
            }
      }
      mysqli_close($db_conn);
      }   
  }
?>