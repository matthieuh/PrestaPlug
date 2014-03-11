angular.module('prestaplug.controllers', [])



.controller('CatalogueCtrl', function($scope, PrestaplugService, ToolsService){
	$scope.catalogue = [];
	// Get catalogue (all id categories)
	/*$scope.catalogue = PrestaplugService.categories()
	    .success(function(data, status, headers) {
        	var json = ToolsService.toJson( data );
	    	console.log(json);
	    	// Get category for each categories id
	    	angular.forEach(json.prestashop.categories.category, function(category, key){
		       PrestaplugService.category(category._id).success(function(data, status, headers) {
		       		$scope.catalogue[category._id] = ToolsService.toJson(data).prestashop.category;
		       		$scope.catalogue[category._id].image = 'http://37.187.60.236/api/images/categories/'+category._id+'?ws_key=RJ93O935CAE7DUJ202R5JORTLCX9QMN4';

		       });
		    });
	    })*/

	console.log($scope.catalogue);


})

.controller('SyncCtrl',function($scope, $rootScope, PrestaplugService, ToolsService, localStorageService){

	$rootScope.key = 'RJ93O935CAE7DUJ202R5JORTLCX9QMN4'
	var elementsToSync = [];
	$scope.savedElems = [];

    /* declare elements to sync */
    elementsToSync[0] = ['category','categories'];
    console.log(elementsToSync[0][0]);
     /* sync all elements */
    angular.forEach(elementsToSync, function(elementToSync, key){

    	PrestaplugService.all(elementToSync[1])
    		.success(function(data, status, headers) {
    			var json = ToolsService.toJson( data );
    			$scope.savedElems[key] = [];
    			console.log(json.prestashop[elementToSync[1]][elementToSync[0]]);	
    			angular.forEach(json.prestashop[elementToSync[1]][elementToSync[0]], function(elem, newkey){
		       		PrestaplugService.details(elementToSync[1],elem._id)
			       		.success(function(data, status, headers) {
			       			console.log(key);
			       			console.log($scope.savedElems[key]);

			       			$scope.savedElems[key].push(ToolsService.toJson(data).prestashop[elementToSync[0]]);
			       		});
			    });
    		});
    });


});
