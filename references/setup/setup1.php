<?php
  if($db = mysqli_connect($_POST["host"],
                         $_POST["user"],
                         $_POST["pass"],
                         null,
                         $_POST["port"]))
    {
        mysqli_query($db,sprintf("CREATE SCHEMA %s",$_POST["dbname"]));
        mysqli_close($db);
    }
    if($db = mysqli_connect($_POST["host"],
                            $_POST["user"],
                            $_POST["pass"],
                            $_POST["dbname"],
                            $_POST["port"]))
    {
      $SqlLists = glob("../sqls/*");
      foreach($SqlLists as $SQL_FILE)
      {
          $SQL_FILE = file_get_contents($SQL_FILE);
          mysqli_query($db,$SQL_FILE);
      }
      mysqli_close($db);
      if(!is_dir($_POST["userdatapath"]))
      {
          mkdir($_POST["userdatapath"]);
      }
      copy("../media/".GP_USER_DEFAULT_PROFILE_PIC,GP_USER_RESOURCE_PATH . '/' . GP_USER_DEFAULT_PROFILE_PIC);
      copy("../media/".GP_USER_DEFAULT_PROJECT_POSTER,GP_USER_RESOURCE_PATH . '/' . GP_USER_DEFAULT_PROJECT_POSTER);
      }
?>