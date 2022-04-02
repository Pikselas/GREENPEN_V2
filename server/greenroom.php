<?php
include "../references/php/defines.php";
 $ResponseJson = ["success"=>false];
if(isset($_GET["code"]))
{
    if($db_conn = mysqli_connect(DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,DATABASE_PORT))
    {
        $SQl = sprintf("SELECT * FROM GREEN_PROJECTS WHERE CODE = %s",$_GET["code"]);
        if($res = mysqli_query($db_conn,$SQl))
        {
            if($res->num_rows > 0)
            {
                $ResponseJson = $res->fetch_assoc(); 
                $ResponseJson["POSTER"] = GP_USER_RESOURCE_ALIAS.'/'. $ResponseJson["POSTER"];
                $ResponseJson["success"] = true;
                $ResponseJson["TAGS"] = [];
                if($res = mysqli_query( $db_conn, sprintf("SELECT TAG FROM GREEN_TAGS WHERE PROJECT_CODE = %s" , $_GET["code"])))
                {
                    while($tg = $res->fetch_assoc())
                    {
                        array_push($ResponseJson["TAGS"] , $tg["TAG"]);
                    }
                }
            }
        }
     mysqli_close($db_conn);
    }
}
echo json_encode($ResponseJson);
?>