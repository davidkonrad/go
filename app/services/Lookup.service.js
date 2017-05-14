'use strict';

angular.module('gulveonlineApp').factory('Lookup', ['ESPBA', 'Utils', function(ESPBA, Utils) {

	//pass data between pages
	var passData = undefined;

	//lookup lists
	var sortItems = [];
	var overfladeItems = [];
	var kvalitetItems = [];
	var kategoriItems = [];
	var enhedItems = [];
	var produktTypeItems = [];
	var profilItems = [];
	var produktItems = [];

	function idToNavn(table, id, field) {
		if (!field) field = 'navn';
		for (var i=0, l=table.length; i<l; i++) {
			if (table[i].id == id) return table[i][field];
		}
		return '';
	};

	function idToItem(table, id) {
		for (var i=0, l=table.length; i<l; i++) {
			if (table[i].id == id) return table[i];
		}
		return '';
	};

	return {

		setPassData: function(data) {
			passData = data;
		},
		getPassData: function(reset) {
			var p = passData;
			//reset by default
			if (reset == undefined || reset == true) passData = undefined;
			return p;
		},

		//lookup service
		init: function() {
			ESPBA.get('kategori', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				kategoriItems = r.data;
			});

			ESPBA.get('sort', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				sortItems = r.data;
			});

			ESPBA.get('overflade', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				overfladeItems = r.data;
			});

			ESPBA.get('kvalitet', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				kvalitetItems = r.data;
			});

			ESPBA.get('enhed', {}).then(function(r) {
				enhedItems = r.data;
			});

			ESPBA.get('produkt_type', {}).then(function(r) {
				produktTypeItems = r.data;
			});

			ESPBA.get('profil', {}).then(function(r) {
				profilItems = r.data;
			});

			ESPBA.get('produkter', {}).then(function(r) {
				produktItems = r.data;
			});

		},

		//get names for record
		sortNavn: function(id) {
			return idToNavn(sortItems, id)
		},
		overfladeNavn: function(id) {
			return idToNavn(overfladeItems, id)
		},
		kvalitetNavn: function(id) {
			return idToNavn(kvalitetItems, id)
		},
		kategoriNavn: function(id) {
			return idToNavn(kategoriItems, id)
		},
		enhedNavn: function(id) {
			return idToNavn(enhedItems, id, 'ental')
		},
		enhedNavnFlertal: function(id) {
			return idToNavn(enhedItems, id, 'flertal')
		},
		enhedSpecifikation: function(id) {
			return idToNavn(enhedItems, id, 'specifikation')
		},
		produktTypeNavn: function(id) {
			return idToNavn(produktTypeItems, id)
		},
		profilNavn: function(id) {
			return idToNavn(profilItems, id)
		},
		getKategori: function(id) {
			for (var i=0, l=kategoriItems.length; i<l; i++) {
				if (kategoriItems[i].id == id) {
					return kategoriItems[i].navn
				}
			}
			return false
		},
		produktNavn: function(id) {
			return idToNavn(produkter, id)
		},

		//return tables
		sortItems: function() {
			return sortItems
		},
		overfladeItems: function() {
			return overfladeItems
		},
		kvalitetItems: function() {
			return kvalitetItems
		},
		kategoriItems: function() {
			return kategoriItems
		},
		enhedItems: function() {
			return enhedItems
		},
		produktTypeItems: function() {
			return produktTypeItems
		},
		profilItems: function() {
			return profilItems
		},
		produktItems: function() {
			return produktItems
		},

		//produkt formatter
		formatProdukt: function(produkt) {
			produkt.kategori = this.kategoriNavn(produkt.kategori_id).trim();
			produkt.sort = this.sortNavn(produkt.sort_id).trim();
			produkt.kvalitet = this.kvalitetNavn(produkt.kvalitet_id).trim();
			produkt.overflade = this.overfladeNavn(produkt.overflade_id).trim();
			produkt.enhed = this.enhedNavn(produkt.enhed_id).trim();
			produkt.profil = this.profilNavn(produkt.profil_id).trim();

			produkt.url = Utils.getProduktLink(produkt);
			produkt.urlName = Utils.urlName(produkt.navn);

			produkt.urlKvalitet = Utils.getOversigtLink('sortering', idToItem(kvalitetItems, produkt.kvalitet_id));
			produkt.urlSort = Utils.getOversigtLink('traesort', idToItem(sortItems, produkt.sort_id));
			produkt.urlProfil = Utils.getOversigtLink('profil', idToItem(profilItems, produkt.profil_id));
			produkt.urlOverflade = Utils.getOversigtLink('overflade', idToItem(overfladeItems, produkt.overflade_id));

			produkt.enhed = this.enhedNavn(produkt.enhed_id);
			produkt.enhed_flertal = this.enhedNavnFlertal(produkt.enhed_id);
			produkt.enhed_spec = this.enhedSpecifikation(produkt.enhed_id);

			produkt.sortPrice = produkt.pris_enhed;

			ESPBA.get('billeder', { produkt_id: produkt.id } ).then(function(b) {
				if (b.data.length) {
					produkt.billede = 'media-uploads/'+b.data[0].path;
					produkt.billeder = b.data;
				} else {
					produkt.billede = 'images/default-picture.jpg';
				}
			});
			ESPBA.get('tilbud', { produkt_id: produkt.id }, { limit: 1 } ).then(function(b) {
				if (b.data.length) {
					produkt.tilbud_pris_enhed = b.data[0].tilbud_pris_enhed;
					produkt.sortPrice = b.data[0].tilbud_pris_enhed;
				}
			});
		}


	}

}]);

