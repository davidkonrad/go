<?php
header('Access-Control-Allow-Origin: *');	

$f = scandir('../media-uploads/');
/*
$folders = array('..', '.');
$files = array_diff($f, $folders);
echo json_encode(array('images' => $files));
*/
echo json_encode(array('images' => $f));

?>
