angular.module('prestaplug.services', [])



.factory('PrestaplugService', function($http) {

  var doRequest = function(type,objectId) {
    return $http({
      method: 'GET',
      url: 'http://37.187.60.236/api/' + type + '/' + objectId,
      params: {ws_key: 'RJ93O935CAE7DUJ202R5JORTLCX9QMN4'}
    });
  }
  return {
    all: function(type) { return doRequest(type,''); },
    details: function(type,id) { return doRequest(type,id); }
  }
})

.factory('ToolsService', function() {
  var toJson = function(data) {
    var x2js = new X2JS();
    var json = x2js.xml_str2json( data );
    return json;
  }
  return {
    toJson: function(data) { return toJson(data);}
  }
})


.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});