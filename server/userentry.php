<?php
  error_reporting(0); // comment this if you are debugging this 
  include "../references/php/defines.php";
  $ResultStat = ["success"=>false,"error"=>null];
  if(isset($_POST["name"]) && isset($_POST["pass"]) && isset($_POST["type"]))
  {
    if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
    {
      $chkSql = sprintf("SELECT * FROM GREEN_USERS WHERE BINARY USERNAME = '%s'",$_POST["name"]);
      $userDtls = mysqli_query($db_conn,$chkSql);
      if($_POST["type"] == "signup")
      {
        $sql = sprintf("INSERT INTO GREEN_USERS(USERNAME,PASSWORD,PROFILEPIC) VALUES('%s','%s','%s')",$_POST["name"],password_hash($_POST["pass"],PASSWORD_DEFAULT),GP_USER_DEFAULT_PROFILE_PIC);
        if($userDtls)
        {
          if($userDtls->num_rows == 0)
          {
            if(mysqli_query($db_conn,$sql))
            {
              $ID = mysqli_query($db_conn,"SELECT LAST_INSERT_ID() AS ID FROM GREEN_USERS");
              if($ID)
              {
                 $ID = $ID->fetch_assoc()["ID"];
                 mkdir(GP_USER_RESOURCE_PATH . '/' . $ID);
                 setcookie("active_user_id",$ID,0,"/","",true,true);
                 setcookie("active_user_name",$_POST["name"],0,"/","",true);
                 setcookie("active_user_profile_pic",GP_USER_RESOURCE_ALIAS .'/'. GP_USER_DEFAULT_PROFILE_PIC,0,"/","",true);
                 $ResultStat["success"] = true;
              }
              else
              {
                $ResultStat["error"] = mysqli_error($db_conn);
              }
            }
            else
            {
              $ResultStat["error"] = mysqli_error($db_conn);
            }
          }
          else
          {
            $ResultStat["error"] = "Username already exists";
          }
        }
        else
        {
          $ResultStat["error"] = mysqli_error($db_conn);
        }
    }
    else if($_POST["type"] == "login")
    {
      if($userDtls)
      {
        if($userDtls->num_rows > 0)
        {
          $userDtls = $userDtls->fetch_assoc();
          if(password_verify($_POST["pass"],$userDtls["PASSWORD"]))
          {
            $ResultStat["success"] = true;
            setcookie("active_user_id",$userDtls["USERID"],0,"/","",true,true);
            setcookie("active_user_name",$_POST["name"],0,"/","",true);
            setcookie("active_user_profile_pic",GP_USER_RESOURCE_ALIAS .'/'.$userDtls["PROFILEPIC"],0,"/","",true);
            $ResultStat["success"] = true;
          }
          else
          {
            $ResultStat["error"] = "Password didn't match";
          }
        }
        else
        {
          $ResultStat["error"] = "User didn't found";
        }
      }
      else
      {
        $ResultStat["error"] = mysqli_error($db_conn);
      }
    }
    else
    {
      $ResultStat["error"] = "Wrong type specified";
    }
    mysqli_close($db_conn);
    }
    else
    {
      $ResultStat["error"] = "Some Databse error";
    }
  }
  else
  {
    $ResultStat["error"] = "Name/Password/Authentication type not specified";
  }
  echo json_encode($ResultStat);
?>