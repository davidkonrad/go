<?php

$host = $_SERVER["SERVER_ADDR"]; 
$localHost = ($host=='127.0.0.1' || $host=='::1');
if ($localHost) {
	header('Access-Control-Allow-Origin	: *');
}

$emne	=	$_GET["emne"];
$email =	$_GET["email"];
$bemaerk = $_GET["bemaerk"];
$telefon = $_GET["telefon"];
$navn = $_GET["navn"];

//send
ini_set('SMTP','send.one.com');
ini_set('SMTP_PORT', '465');

$body='<html><body>'.
      'Ny Kontaktformular - '.date(DATE_RFC822).'<br>'.
      'Fra : '. $navn. '<br>'.
      'Telefon : '. $telefon. '<br>'.
      'Email : '. $email .'<br>'.
			'Emne : '. $emne . '<br>'.
      'Tekst : '. $bemaerk .'<br><br>'.
      '</body></html>';

$headers ='';
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From: Kontaktformular<kontaktformular@hallandparket.dk>'. "\r\n";
$headers .= 'ReplyTo: Kontaktformular<kontaktformular@hallandparket.dk>'. "\r\n";
$headers .= 'subject: "Kontaktformular"'. "\r\n";

//also send mail to me, test!
//$send1 = mail('info@4horizons.com', 'Kontaktformular', $body, $headers);
$send = mail('info@hallandparket.dk', 'Kontaktformular', $body, $headers);

echo json_encode(array('stat' => $send ));

/*
if ($result) {
	echo json_encode(array('message' => true ));
} else {
	echo json_encode(array('message' => false ));
}
*/

?>
