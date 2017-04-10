'use strict';

angular.module('gulveonlineApp').factory('Utils', function() {

	return {
		dataTables_daDk: {
	    "sEmptyTable":     "Ingen tilgængelige data (prøv en anden søgning)",
	    "sInfo":           "Viser _START_ til _END_ af _TOTAL_ rækker",
	    "sInfoEmpty":      "Viser 0 til 0 af 0 rækker",
 		  "sInfoFiltered":   "(filtreret ud af _MAX_ rækker ialt)",
 		  "sInfoPostFix":    "",
 		  "sInfoThousands":  ",",
	    "sLengthMenu":     "Vis _MENU_ rækker",
	    "sLoadingRecords": "Henter data...",
	    "sProcessing":     "Processing...",
	    "sSearch":         "Filter:",
	    "sZeroRecords":    "Ingen rækker matchede filter",
	    "oPaginate": {
        "sFirst":    "Første",
        "sLast":     "Sidste",
        "sNext":     "Næste",
        "sPrevious": "Forrige"
	    },
	    "oAria": {
        "sSortAscending":  ": activate to sort column ascending",
        "sSortDescending": ": activate to sort column descending"
	    }
		},

		todayStr: function() {
			var d = new Date();	
			var s = d.getDate();
			s+= '-'+(d.getMonth()+1);
			s+= '-'+d.getFullYear();
			return s;
		}

	}

});


