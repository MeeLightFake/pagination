<?php

header('application/json');

include_once('./function.php');

if (isset($_POST['page']))
{
    $page = $_POST['page'];
    echo searchProduct($page);
}
