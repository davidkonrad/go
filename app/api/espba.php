<?
/**
 * espda.php		Database driver for the ESPBA angular 1.x service
 * @copyright   Copyright (C) 2017 david konrad, davidkonrad at gmail com
 * @license     Licensed under the MIT License; see LICENSE.md
 */

/*
error_reporting(E_ALL & ~E_NOTICE); 
ini_set('display_errors', '1');
*/

include('Db.php');

class ESPBA extends DbPDO {
	private $table;

/**
	* constructor
	* @param $table	string, the table name
	* @param $array array, $_GET or $_POST
  * @desc Allow the script being executed from foreign locations. 
	* @desc Note: This is optional. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
	*/
	public function __construct($table, $array) {
		parent::__construct();
		
		if ($this->isLocalhost()) {
			header('Access-Control-Allow-Origin	: *');
		}

		$this->table = $table;
		$this->process($array);
	}

/**
  * @desc process a CRUD request, i.e insert, get, update and delete
  * @param array $array, essentially the $_GET 
	*/
	public function process($array) {
		$action = $array['__action'];
		unset($array['__action']);
		switch ($action) {
			case 'insert' :
				$this->insert($array);
				break;

			case 'get' :
				$this->get($array);
				break;

			case 'delete' :
				$this->delete($array);
				break;

			case 'update' :
				$this->update($array);
				break;

			default:
				echo $this->err('Not recognizeable "'.$action.'"', 'bad request');
				break;
		}
	}


/**
  * @desc return error message or latest database error
  * @param string $action
  * @param string $message
  * @return JSON string
	*/
	public static function err($action, $message = '') {
		$err = array(
			'failed' => $action,
			'message' => $message != '' ? $message : 'error' //Espb::error()
		);
		return json_encode($err);
	}


/**
  * @desc return params (i.e part of $_GET) as content of a WHERE clause
  * @param array $array
  * @return string
	*/
	private function getParams($array) {
		$r = '';
		foreach ($array as $key => $value) {
			if ($r !='') $r.=' and ';
			$r.=$key.'='.$this->s($value);
		}
		return $r;
	}


/**
  * @desc executes a SELECT based on params in $array
  * If no params is set, the entire dataset is retrieved
  * @param array $array
  * @return JSON string
	*/
	public function get($array) {
		$limit = '';
		$orderBy = '';

		if (isset($array['__limit'])) {
			$limit = ' limit '.$array['__limit'];
			unset($array['__limit']);
		}
		if (isset($array['__orderBy'])) {
			$orderBy = ' order by '.$array['__orderBy'];
			unset($array['__orderBy']);
		}
			
		$params = $this->getParams($array);
		if ($params != '') $params = ' where '.$params;

		$SQL = 'select * from '.$this->table.$params;
		$SQL.= $orderBy.$limit;
		
		$result = $this->queryJSON($SQL);
		echo $result;
	}

/**
  * @desc executes an UPDATE based on params in $array
  * @param array $array
  * @return JSON string. The inserted record, if any. 
	*/
	public function update($array) {
		$id = isset($array['id']) ? $array['id'] : false;
		if (!$id) {
			$this->err('update', 'id is missing');
			return;
		}
		unset($array['id']);
		$SQL = 'update '.$this->table.' set ';
		$update = '';
		foreach($array as $key => $value) {
			if ($update != '') $update.=', ';
			$update.=$key.'='.$this->s($value);
		}
		$SQL.=$update.' where id='.$id;
		$this->exec($SQL);

		//return updated object, if any
		echo $this->get(array('id' => $id));		
	}


/**
  * @desc executes a INSERT based on params in $array
  * @param array $array
  * @return JSON string
	*/
	public function insert($array) {
		$keys = array_keys($array);
		$keys = ' (' . implode(',', $keys).')';

		$v = array_values($array);
		$insertValues = '';
		foreach($v as $value) {
			if ($insertValues != '') $insertValues.=', ';
			$insertValues .= $this->s($value);
		}
		$insertValues = ' values ('. $insertValues. ')';

		$SQL = 'insert into '.$this->table.$keys.$insertValues;

		$this->exec($SQL);
	
		//return the inserted object or error
		$id = $this->lastInsertId();
		if (!$id) {
			echo $this->err('insert');
		} else {
			echo $this->get(array('id' => $id));
		}
	}


/**
  * @desc executes a DELETE based on params in $array
  * @param array $array
  * @return JSON string, OK or error message
	*/
	public function delete($array) {
		$params = $this->getParams($array);
		if ($params != '') $params = ' where '.$params;

		$SQL = 'delete from '.$this->table.$params;
		
		print_r($this->error());

		$this->exec($SQL);
		if ($this->error()) {
			echo $this->err('delete', $SQL);
		} else {
			echo json_encode(array('recordsDeleted' => 'true'));
		}
	}
}


/**
	*
	*/
if (!$_GET) {
	Espb::err('Params expected');
	return;
}

$params = $_GET;
$table = isset($params['__table']) ? $params['__table'] : false;

if (!$table) {
	Espb::err('Table not set');
	return;
}

unset($params['__table']);

$run = new ESPBA($table, $params);

?>
