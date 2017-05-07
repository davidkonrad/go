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
        "sSortAscending":  ": Sorter kolonne faldende",
        "sSortDescending": ": Sorter kolonne stigende"
	    }
		},

		//fix name with spaces and æøå for url use
		urlName: function(s) {
			s = s.replace(/ /g, '-');
			s = s.replace(/[\/]/g, '-');
			s = s.replace(/æ/g, 'ae');
			s = s.replace(/ø/g, 'oe');
			s = s.replace(/å/g, 'aa');
			s = s.replace(/é/g, 'e');
			s = s.replace(/---/g, '-');
			s = s.replace(/--/g, '-');
			return s;
		},

		todayStr: function() {
			var d = new Date();	
			var s = d.getDate();
			s+= '-'+(d.getMonth()+1);
			s+= '-'+d.getFullYear();
			return s;
		},

		plainText: function(snippet) {
			var div = document.createElement("div"); //will be garbage collected, no need to remove
			div.innerHTML = snippet;
			var text = div.textContent || div.innerText || "";
			return text;
		}

	}

});


