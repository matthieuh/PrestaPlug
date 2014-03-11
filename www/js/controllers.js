angular.module('prestaplug.controllers', [])

.controller('IntroCtrl', function($scope, $location) {
 
  // Called to navigate to the main app
  var startApp = function() {
    $location.path('tab/catalogue/2')

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  //No this is silly
  // Check if the user already did the tutorial and skip it if so
  /*if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    startApp();
  }*/
  

  // Move to the next slide
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };

  // Our initial right buttons
  var rightButtons = [
    {
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }
  ];
  
  // Our initial left buttons
  var leftButtons = [
    {
      content: 'Skip',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Start the app on tap
        startApp();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function(index) {

    // Check if we should update the left buttons
    if(index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }
    
    // If this is the last slide, set the right button to
    // move to the app
    if(index == 2) {
      $scope.rightButtons = [
        {
          content: 'Start using MyApp',
          type: 'button-positive button-clear',
          tap: function(e) {
            startApp();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  };
})


.controller('CatalogueCtrl', function($scope, $rootScope, $stateParams, localStorageService, $location){
	/* INIT */
	$scope.toIntro = function(){
	    window.localStorage['didTutorial'] = "false";
	    $state.go('intro');
	  }
	$scope.level = $stateParams.level;
	$rootScope.key = 'RJ93O935CAE7DUJ202R5JORTLCX9QMN4';

	$rootScope.gotoCat = function(category){
		console.log(category.associations.products.category);
		console.log(category.associations.products.product);
		if (typeof category.associations.categories.category != 'undefined') {
			console.log("go to categories");
			var levelDown = parseInt($scope.level,10) + 1;
	        $location.url('/tab/catalogue/'+levelDown);
		} else if (typeof category.associations.products.product != 'undefined'){
			console.log("go to products");
			$location.url('/tab/category/'+category.id.__cdata);
			
	    }

    }


	$scope.catalogue = localStorageService.get('categories');

	console.log($scope.catalogue);


})

.controller('CategoryCtrl', function($scope, $stateParams, localStorageService, $location, _){
	/* INIT */
	var idcat = $stateParams.idcat;
	var categories = localStorageService.get('categories');
	$scope.category = categories[parseInt(idcat,10)-1];
	console.log(categories);
	console.log($scope.category);

})

.controller('SyncCtrl',function($scope, PrestaplugService, ToolsService, localStorageService, $stateParams, $location){

    $scope.sync = function (callback) {
    	$scope.step = "Synchronisation : lancement...";
        $scope.syncProgress = 0;

		var elementsToSync = [];
		$scope.savedElems = [];

	    /* declare elements to sync */
	    elementsToSync[0] = ['category','categories'];
	    elementsToSync[1] = ['product','products'];
	     /* sync all elements */
	    angular.forEach(elementsToSync, function(elementToSync, key){ 	
	    	PrestaplugService.all(elementToSync[1])
	    		.success(function(data, status, headers) {
	    			$scope.step = "Synchronisation : "+elementToSync[1]+"...";
	    			$scope.syncProgress += 100 / elementsToSync.length ;
	    			var json = ToolsService.toJson( data );
	    			$scope.savedElems[key] = [];
	    			/* get categories details */
	    			angular.forEach(json.prestashop[elementToSync[1]][elementToSync[0]], function(elem, newkey){
			       		PrestaplugService.details(elementToSync[1],elem._id)
				       		.success(function(data, status, headers) {
				       			$scope.savedElems[key].push(ToolsService.toJson(data).prestashop[elementToSync[0]]);
				       			console.log(elementToSync[1]);
				       			localStorageService.add(elementToSync[1], $scope.savedElems[key]);
				       		});
				    });
				    
	    		});
	    });

	    $scope.$watchCollection("savedElems", function( newValue, oldValue ) {
	    	console.log(newValue.length);
	    	if (elementsToSync.length == newValue.length) {
	    		callback();
	    	}
        });
	    
	}

	$scope.syncFinished = function(){
        console.log('finished');

        $scope.step = "Synchronisation : terminée !";
    }



});
