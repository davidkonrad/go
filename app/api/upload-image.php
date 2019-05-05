<?php
	header('Access-Control-Allow-Origin: *');	

	$filename = $_FILES['file']['name'];
	$path_info = pathinfo($filename);
	$ext = $path_info['extension'];
	$new = time().'.'.$ext;
  $meta = $_POST;
  $destination = $meta['targetPath'] . $new; 
  move_uploaded_file( $_FILES['file']['tmp_name'] , $destination );
	
	$a = array('filename' => $new);
	echo json_encode($a);
?>
