<?php
  include "php/defines.php";
  if($DB = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,null,DATABASE_PORT))
  {
      mysqli_query($DB,sprintf("CREATE SCHEMA %s",DATABASE_NAME));
      mysqli_close($DB);
  }
  if($DB = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
  {
      $SqlLists = glob("sqls/*");
      foreach($SqlLists as $SQL_FILE)
      {
          $SQL_FILE = file_get_contents($SQL_FILE);
          if($SQL_FILE != false)
          {
            mysqli_query($DB,$SQL_FILE);
          }
      }
      mysqli_close($DB);
     echo "<h1><b>setup completed</b> for <b><i>GREENPEN</i></b></h1>";
  }
?>