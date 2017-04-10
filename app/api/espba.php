<?

include('Db.php');

//Extremely Simple PHP+mySQL Backend for Angular
//espmb

/*
error_reporting(E_ALL & ~E_NOTICE); 
ini_set('display_errors', '1');
*/

class Espb extends Db {
	private $table;

	public function __construct($table, $array) {
		parent::__construct();
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
			'message' => $message != '' ? $message : $this->error()
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

	public function getAll($table) {
	}

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
		echo $SQL;
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

	}
}

header('Access-Control-Allow-Origin: *');

$params = $_GET;
$table = isset($params['__table']) ? $params['__table'] : false;

if (!$table) {
	Espba::err('Table not set');
	return;
}

unset($params['__table']);

$run = new Espb($table, $params);

?>
