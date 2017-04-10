'use strict';

angular.module('gulveonlineApp').factory('Lookup', ['ESPBA', function(ESPBA) {

	var sortItems = [];
	var overfladeItems = [];
	var kvalitetItems = [];
	var kategoriItems = [];
	var enhedItems = [];
	var produktTypeItems = [];

	function idToNavn(table, id, field) {
		if (!field) field = 'navn';
		for (var i=0, l=table.length; i<l; i++) {
			if (table[i].id == id) return table[i][field]
		}
		return ''
	};

	return {

		init: function() {
			ESPBA.get('kategori', {}).then(function(r) {
				kategoriItems = r.data;
			})
			ESPBA.get('sort', {}).then(function(r) {
				sortItems = r.data;
			})
			ESPBA.get('overflade', {}).then(function(r) {
				overfladeItems = r.data;
			})
			ESPBA.get('kvalitet', {}).then(function(r) {
				kvalitetItems = r.data;
			})
			ESPBA.get('enhed', {}).then(function(r) {
				enhedItems = r.data;
			})
			ESPBA.get('produkt_type', {}).then(function(r) {
				produktTypeItems = r.data;
			})

		},

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
		produktTypeNavn: function(id) {
			return idToNavn(produktTypeItems, id)
		},

		getKategori: function(id) {
			for (var i=0, l=kategoriItems.length; i<l; i++) {
				if (kategoriItems[i].id == id) {
					return kategoriItems[i].navn
				}
			}
			return false
		}
	}

}]);

