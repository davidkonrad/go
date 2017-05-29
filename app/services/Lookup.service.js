'use strict';

angular.module('gulveonlineApp').factory('Lookup', ['$q', 'ESPBA', 'Utils', function($q, ESPBA, Utils) {

	//pass data between pages
	var passData = undefined;

	//lookup lists
	var sortItems = undefined;
	var overfladeItems = undefined;
	var kvalitetItems = undefined;
	var kategoriItems = undefined;
	var enhedItems = undefined;
	var produktTypeItems = undefined;
	var profilItems = undefined;
	var produktItems = undefined;

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
			var	deferred = $q.defer();

			var check = function() {
				if (profilItems && overfladeItems && kvalitetItems && sortItems && kategoriItems) {
		      deferred.resolve();
				}
			};
			check(); //subsitutes a method for "already initted"

			ESPBA.get('profil', {}).then(function(r) {
				profilItems = r.data;
				check();
			});

			ESPBA.get('overflade', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				overfladeItems = r.data;
				check();
			});

			ESPBA.get('kvalitet', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				kvalitetItems = r.data;
				check();
			});

			ESPBA.get('kategori', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				kategoriItems = r.data;
				check();
			});

			ESPBA.get('sort', {}).then(function(r) {
				r.data.sort(function(a, b) {
					return a.navn.localeCompare(b.navn)
				});
				sortItems = r.data;
				check();
			});

			ESPBA.get('enhed', {}).then(function(r) {
				enhedItems = r.data;
			});

			ESPBA.get('produkt_type', {}).then(function(r) {
				produktTypeItems = r.data;
			});

			ESPBA.get('produkter', {}).then(function(r) {
				produktItems = r.data;
			});

      return deferred.promise;

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

		//construct a filter array of literals for ng-repeats in produktList.html
		filterByProduktList: function(produktList) {
			var list = undefined;
			for (var i=0, l=produktList.length; i<l; i++) {
				if (!list[produktList[i].kategori]) {
					list[produktList[i].kategori] = produktList[i].kategori_id;
				}
			}
			var filter = undefined;
			filter.push( { filter: '', navn: 'Alle' } );
			for (var gulvtype in list) {
				filter.push( { filter: { kategori_id: list[gulvtype] }, navn: gulvtype } );
			}
			return filter;
		},

		//return if produkt with attr == value exists
		hasProdukterWithAttr: function(attrName, value) {
			for (var i=0, l=produktItems.length; i<l; i++) {
				if (produktItems[i][attrName] == value && produktItems[i].aktiv) return true;
			}
			return false;
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
			produkt.urlOverflade = Utils.getOversigtLink('overflade-behandling', idToItem(overfladeItems, produkt.overflade_id));

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

