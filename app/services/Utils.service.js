'use strict';

angular.module('hallandparketApp').factory('Utils', function() {

	var isLocalHost = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
	var urlLinkBase = isLocalHost ? 'http://localhost:9000/#/' : 'https://hallandparket.dk/'; 

	String.prototype.quote = function() {
		return '"' + this + '"';
	}

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

		//get current date in danish format
		todayStr: function(delimiter) {
			if (!delimiter) delimiter = '-';
			var d = new Date();	
			var s = d.getDate();
			s+= delimiter + (d.getMonth()+1);
			s+= delimiter + d.getFullYear();
			return s;
		},

		//return plain text from HTML snippet
		plainText: function(snippet) {
			var div = document.createElement("div"); //will be garbage collected, no need to remove
			div.innerHTML = snippet;
			var text = div.textContent || div.innerText || "";
			return text;
		},

		//get a fully qualified kategori link
		getKategoriLink: function(kategori) {
			if (!kategori.navn || !kategori.id) return this.urlLinkBase;
			return urlLinkBase + 'kategori/'+ this.urlName(kategori.navn) + '/'+ kategori.id;
		},

		//get a fully qualified produkt link
		getProduktLink: function(produkt) {
			if (!produkt.navn || !produkt.id) return this.urlLinkBase;
			return urlLinkBase + 'produkt/'+ this.urlName(produkt.navn) + '/'+ produkt.id;
		},

		//get a fully qualified oversigt/kategori link
		getOversigtLink: function(pseudoKategori, item) {
			if (!item.navn || !item.id) return this.urlLinkBase;
			return urlLinkBase + 'oversigt/'+ pseudoKategori + '/' + this.urlName(item.navn) + '/'+ item.id;
		}


	}

});

