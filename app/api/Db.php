<?
/**
 * Db.php				PDO wrapper for ESPBA
 * @copyright   Copyright (C) 2017 david konrad, davidkonrad at gmail com
 * @license     Licensed under the MIT License; see LICENSE.md
 */

/*
ini_set('display_errors', '1');
error_reporting(E_ALL);
*/

include('pw.php');

class Db {
	private $database;
	private $hostname;
	private $username;
	private $password;
	private $host;
	private $charset = 'utf8';
	private $pdo;
  
	public function __construct() { 
		global $pw_local, $pw_server;

		$this->host = $_SERVER["SERVER_ADDR"]; 
		if (($this->host=='127.0.0.1') || ($this->host=='::1')) {
			$this->database = $pw_local['database']; 
			$this->hostname = $pw_local['hostname'];
			$this->username = $pw_local['username'];
			$this->password = $pw_local['password'];
		} else {
			$this->database = $pw_server['database']; 
			$this->hostname = $pw_server['hostname'];
			$this->username = $pw_server['username'];
			$this->password = $pw_server['password'];
		}

		$dsn = "mysql:host=".$this->hostname.";dbname=".$this->database.";charset=".$this->charset;
		$opt = [
	    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	    PDO::ATTR_EMULATE_PREPARES   => false
		];

		try {
			$this->pdo = new PDO($dsn, $this->username, $this->password, $opt);
		} catch(PDOException $e){
			echo "Error connecting to mysql: ". $e->getMessage();
		}
	}

	private function query($SQL) {
		$result = $this->pdo->query($SQL);
		return $result;
	}

	protected function exec($SQL) {
		$this->pdo->query($SQL);
	}

	protected function s($s) {
		return $this->pdo->quote($s);
	}

	protected function error($s) {
		$err = $this->pdo->errorInfo();
		return implode(';', $err);
	}

	protected function lastInsertId() {
		return $this->pdo->lastInsertId();
	}

	public function queryJSON($SQL) {
		$result = $this->query($SQL);
		$return = array();
		while ($row = $result->fetch()) {
			$return[]=$row;
		}
		return json_encode($return);
	}
}

/*
$test = new Db();
$a = $test->queryJSON('select * from overflade');
echo $a;
*/

?>
