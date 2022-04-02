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
                $Result["def_path"] = GP_USER_RESOURCE_ALIAS .'/'.$res.'/'.$_GET["code"];
                $Result = array_merge($Result,json_decode(file_get_contents(GP_USER_RESOURCE_PATH . '/' . $res.'/'.$_GET["code"] ."/GP_SCRIPT.json"),true));
                }
            }
        }
        echo json_encode($Result);
    }
    else if($_GET["type"] == "UPDATE_PROJECT" && isset($_GET["code"]))
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
              $result["success"] = true;
               mysqli_query($db_conn , sprintf("UPDATE GREEN_PROJECTS SET UPDATED = NOW() WHERE CODE = %s",$_GET["code"]));
               $ProjPath = GP_USER_RESOURCE_PATH . '/' . $qRes->fetch_assoc()["AUTHORID"] . '/' . $_GET["code"] ;
               $ProjScriptPath = $ProjPath . '/GP_SCRIPT.json';
               $NewAdd = json_decode($_POST["NEW_ADD"],true);
               $Changes = json_decode($_POST["CHANGES"],true);
               foreach($NewAdd["FOLDERS"] as $folder => $empt)
               {
                 mkdir($ProjPath . '/' . $folder);
               }
               foreach($Changes as $chng)
               {
                 //moving files from one folder to onother
                 rename($ProjPath . '/' .$chng["source"],$ProjPath . '/' .$chng["dest"]);
               }
               if(isset($_FILES["TempFiles"]))
               {
                $TempFileDest = json_decode($_POST["TempFilePaths"],true);
                $FileSize = count($_FILES["TempFiles"]["tmp_name"]);
                for($i = 0 ; $i < $FileSize ; $i++)
                {
                  move_uploaded_file($_FILES["TempFiles"]["tmp_name"][$i],$ProjPath .'/'. $TempFileDest[$i]);
                }
               }
               if(isset($_POST["DELETED"]))
               {
                $Deleted = json_decode($_POST["DELETED"],true);
                foreach($Deleted["FILES"] as $fl)
                {
                  if(is_file($ProjPath . '/' . $fl))
                  {
                    unlink($ProjPath . '/' . $fl);
                  }
               }
               foreach($Deleted["FOLDERS"] as $dir)
               {
                 if(is_dir($ProjPath . '/' . $dir))
                 {
                   rmdir($ProjPath . '/' .$dir);
                 }
               }
              }
              if(isset($_POST["ADDED_TAGS"]))
              {
                foreach(json_decode($_POST["ADDED_TAGS"] , true) as $tag => $val)
                {
                  mysqli_query($db_conn , sprintf("INSERT INTO GREEN_TAGS values('%s' , %s)" , $tag , $_GET["code"]));
                }
              }
              if(isset($_POST["REMOVED_TAGS"]))
              {
                foreach(json_decode($_POST["REMOVED_TAGS"] , true) as $tag => $val)
                {
                  mysqli_query($db_conn , sprintf("DELETE FROM GREEN_TAGS WHERE PROJECT_CODE = %s AND TAG = '%s'" , $_GET["code"] , $tag));
                }
              }
              file_put_contents($ProjScriptPath,json_encode(json_decode($_POST["JSON"]),JSON_PRETTY_PRINT));
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