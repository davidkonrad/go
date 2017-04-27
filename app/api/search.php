<?

include('Db.php');

class Search extends DbPDO {

	public function __construct() {
		parent::__construct();
		
		if ($this->isLocalhost()) {
			header('Access-Control-Allow-Origin	: *');
		}

		if ( !$_GET || !isset($_GET['term']) || empty($_GET['term']) ) {
			echo json_encode(array('error' => 'Søgeord mangler' ));
			return;
		}
		$term = $_GET['term'];

		$SQL = 'select distinct p.* from ';
		$SQL.= 'produkter p, profil r, kategori k, sort s, overflade o, kvalitet v ';

		$where = '';
		$array = explode(' ', $term);

		foreach($array as $t) {
			if ($where != '') $where.=' and ';

			if (strtolower($t) == 'tilbud') {
				$w = ' ( p.produkt_type_id = 2 ) ';
			} else {
				$w = ' (';
				$w.= 'p.navn like "%'.$t.'%" or ';
				$w.= '(r.navn like "%'.$t.'%" and r.id = p.profil_id) or ';
				$w.= '(k.navn like "%'.$t.'%" and k.id = p.kategori_id) or ';
				$w.= '(s.navn like "%'.$t.'%" and s.id = p.sort_id) or ';
				$w.= '(o.navn like "%'.$t.'%" and o.id = p.overflade_id) or ';
				$w.= '(v.navn like "%'.$t.'%" and v.id = p.kvalitet_id) or ';
				$w.= 'p.dimension like "%'.$t.'%" ';
				$w.= ')';
			}

			$where.=$w;
		}

		$SQL.=' where '.$where;

		$result = $this->queryJSON($SQL);
		echo $result;
	}
}


/**
	*
	*/
$search = new Search( $_GET['term'] );

?>
