<?php
 foreach($_COOKIE as $key=>$value)
 {
    setcookie($key,null,-1,"/","",true);
 }
?>