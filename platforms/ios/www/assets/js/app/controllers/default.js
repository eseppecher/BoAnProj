
var db;

myApp.filter('makeRate', function ($filter) {
             return function (input) {
             if(input === -1){ return ''; }
             if(input === 0){ return '<span class="glyphicon glyphicon-thumbs-down"></span>'; }
             if(input === 1){ return '<span class="glyphicon glyphicon-star"></span>'; }
             if(input === 2){ return '<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span>'; }
             if(input === 3){ return '<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span>'; }
           
             
             return "-";
             };
});


//Main controller
myApp.controller('mainController', function($scope, localStorageService, $location, $webSql) {

	$scope.title	= 'Homepage';
                 
    $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
    };
                 
     //WEB SQL filling database
    // reading from html files with json architecture
    var dataSites, dataSectors, dataLines, dataParkings = [];
    $.ajax({ url: 'datas/html/sites.html', type:'get', async:false, success: function(html, $scope) { dataSites = angular.fromJson( String(html)); } });
    $.ajax({ url: 'datas/html/sectors.html', type:'get', async:false, success: function(html, $scope) { dataSectors = angular.fromJson( String(html)); } });
    $.ajax({ url: 'datas/html/lines.html', type:'get', async:false, success: function(html, $scope) { dataLines = angular.fromJson( String(html)); } });
    $.ajax({ url: 'datas/html/parkings.html', type:'get', async:false, success: function(html, $scope) { dataParkings = angular.fromJson( String(html)); } });
           
                 
    db = $webSql.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); // opening db
    
    // deleting tables making room for new data and dat architecture
    db.dropTable("sites");
    db.dropTable("sectors");
    db.dropTable("lines");
    db.dropTable("parkings");
               
    // creating tables
    db.createTable('sites', { "id":{"type":"INTEGER"},"name":{ "type": "TEXT"}, "description": { "type": "TEXT"}, "tags": { "type": "TEXT"}, "couverture": { "type": "TEXT" }, "latitude": { "type": "TEXT" }, "longitude": { "type": "TEXT" }, "volume": { "type": "INTEGER" } });
    
    db.createTable('sectors', { "id":{"type":"INTEGER"},"name":{ "type": "TEXT"}, "latitude": { "type": "TEXT" }, "longitude": { "type": "TEXT" }, "approach": { "type": "TEXT" }, "volume": { "type": "INTEGER" }, "site": { "type": "INTEGER" } });
                 
    db.createTable('lines', { "id":{"type":"INTEGER"},"name":{ "type": "TEXT"}, "grade": { "type": "TEXT" }, "rate": { "type": "INTEGER" }, "latitude": { "type": "TEXT" }, "longitude": { "type": "TEXT" }, "description": { "type": "TEXT" }, "image": { "type": "TEXT" }, "site": { "type": "INTEGER" }, "sector": { "type": "INTEGER" } });
    db.createTable('parkings', { "id":{"type":"INTEGER"}, "latitude": { "type": "TEXT" }, "longitude": { "type": "TEXT" }, "site": { "type": "INTEGER" } });
    

    // filling tables with data
                 
    for(var i=0; i< dataSites.length; i++){
        db.insert('sites', {"id": dataSites[i].id, "name": dataSites[i].name, "description": dataSites[i].description, "tags": dataSites[i].tags, "couverture": dataSites[i].couverture, "latitude": dataSites[i].latitude, "longitude": dataSites[i].longitude, "volume": dataSites[i].volume}).then(function(results) { console.log(results.insertId); });
    }
    for(var i=0; i< dataSectors.length; i++){
        db.insert('sectors', {"id": dataSectors[i].id, "name": dataSectors[i].name, "latitude": dataSectors[i].latitude, "longitude": dataSectors[i].longitude, "approach": dataSectors[i].approach, "volume": dataSectors[i].volume, "site": dataSectors[i].site}).then(function(results) { console.log(results.insertId); });
    }
    for(var i=0; i< dataLines.length; i++){
        db.insert('lines', {"id": dataLines[i].id, "name": dataLines[i].name, "grade": dataLines[i].grade, "rate": dataLines[i].rate, "latitude": dataLines[i].latitude, "longitude": dataLines[i].longitude, "description": dataLines[i].description, "image": dataLines[i].image, "site": dataLines[i].site, "sector": dataLines[i].sector}).then(function(results) { console.log(results.insertId); });
    }
    for(var i=0; i< dataParkings.length; i++){
        db.insert('parkings', {"id": dataParkings[i].id, "latitude": dataParkings[i].latitude, "longitude": dataParkings[i].longitude, "site": dataParkings[i].site}).then(function(results) { console.log(results.insertId); });
    }

                 
                 
                 
                 
    localStorageService.clearAll();
                 

    //sites
    localStorageService.set('site.1','{ "id":1,"name": "Fenouillet", "latitude": 43.136443, "longitude": 6.098854, "couv": "fenouillet.jpg", "description": "Le spot de bloc toulonnais! Dans la foret des colines qui dominent Hyeres, le site offre de jolie bloc en gneiss bien compact. A l ombre des arbres et donc souvent humide aussi.", "tag": "#toulon #gneiss", "volume": "13"}');
    localStorageService.set('site.2','{ "id":2,"name": "Gordolasque", "latitude": 44.075890, "longitude": 7.401487, "couv": "gordolasque.jpg", "descritpion": "Dans la vallee de la gordolasque, la fin de la route se termine par un chaos de beaux blocs parfois haut. Le cadre magique du debut du parc du Mercantour et magique! Frais en été et froid en hiver le site et parfait pour fuire la foule et les chaleurs de la cote.", "tag": "#montagne #mercantour #bellevedere #gneiss", "volume": "4"}');
    localStorageService.set('site.3','{ "id":3,"name": "Roquebrune", "latitude": 43.457493, "longitude": 6.597758, "couv": "roquebrune.jpg", "description": "Inevitable depuis l autoroute, le rocher de roqueburne atire l oeil. Sur les flancs de la montagne on touve de nobreuses boules de conglomérat rouge. Faute de pouvoir équiper les falaises qui les suplombent, la quantité de bloc est impressionante et le site est en pleine expension.", "tag": "#conglomerat #ermite", "volume": "15"}');
    
    //parkings
    localStorageService.set('parking.1','{ "id":1, "latitude": 43.135942, "longitude": 6.098633, "site": 1}');
    localStorageService.set('parking.2','{ "id":2, "latitude": 43.458484, "longitude": 6.603060, "site": 2}');
    localStorageService.set('parking.3','{ "id":3, "latitude": 44.073823, "longitude": 7.400043, "site": 3}');

                 
    //sectors
    localStorageService.set('sector.1','{ "id":1,"name": "Squamish", "latitutde": 43.136826, "longitude": 6.096699, "approach": "15min", "site": 1}');
    localStorageService.set('sector.2','{ "id":2,"name": "Parking", "latitude": 43.136145, "longitude": 6.099227, "approach": "15min", "site": 1}');
    localStorageService.set('sector.3','{ "id":3,"name": "Espigoule", "latitude": 43.138010, "longitude": 6.102571, "approach": "15min", "site": 1}');
    localStorageService.set('sector.4','{ "id":4,"name": "Parking", "latitude": 44.074160, "longitude": 7.400161, "approach": "15min", "site": 2}');
    localStorageService.set('sector.5','{ "id":5,"name": "Chaos", "latitude": 44.077724, "longitude": 7.401964, "approach": "15min", "site": 2}');
    localStorageService.set('sector.6','{ "id":6,"name": "Cascade", "latitude": 43.455697, "longitude": 6.601392, "approach": "15min", "site": 3}');
    localStorageService.set('sector.7','{ "id":7,"name": "Chapelle", "latitude": 43.458971, "longitude": 6.592596, "approach": "15min", "site": 3}');

                 
    //lines Fenouilllet/Squamish
    localStorageService.set('line.1','{ "id":1,"name": "Pose ton cul","latitude": 43.136826, "longitude": 6.096699, "images": ["1.jpg", "2.jpg"], "grade": "7a", "site": 1, "sector": 1}');
    localStorageService.set('line.2','{ "id":2,"name": "La force tranquille", "latitude": 43.136826, "longitude": 6.096699, "images": ["1.jpg"], "grade": "7a+", "site": 1, "sector": 1}');
    localStorageService.set('line.3','{ "id":3,"name": "Put your ass", "latitude": 43.136826, "longitude": 6.096699, "images": ["1.jpg"], "grade": "7a+", "site": 1, "sector": 1}');
    localStorageService.set('line.4','{ "id":4,"name": "Lili", "latitude": 43.136826, "longitude": 6.096699, "grade": "7b+", "images": ["1.jpg"], "site": 1, "sector": 1}');
    localStorageService.set('line.5','{ "id":5,"name": "Orange and grey", "latitude": 43.136826, "longitude": 6.096699, "images": ["1.jpg"], "grade": "7a+", "site": 1, "sector": 1}');
    
    //lines Fenouilllet/Parking
    localStorageService.set('line.6','{ "id":6,"name": "Pulpe friction", "latitude": 43.136145, "longitude": 6.099227, "images": ["1.jpg"], "grade": "7a+", "site": 1, "sector": 2}');
    localStorageService.set('line.7','{ "id":7,"name": "Big traverse", "latitude": 43.136145, "longitude": 6.099227, "images": ["1.jpg"], "grade": "7a", "site": 1, "sector": 2}');
    localStorageService.set('line.8','{ "id":8,"name": "N33", "latitude": 43.136145, "longitude": 6.099227, "images": ["1.jpg"], "grade": "6a", "site": 1, "sector": 2}');
    localStorageService.set('line.9','{ "id":9,"name": "N30", "latitude": 43.136145, "longitude": 6.099227, "images": ["1.jpg"], "grade": "6b", "site": 1, "sector": 2}');
    localStorageService.set('line.10','{ "id":10,"name": "N32", "latitude": 43.136145, "longitude": 6.099227, "images": ["1.jpg"], "grade": "6b", "site": 1, "sector": 2}');

    //lines Fenouilllet/Espigoule
    localStorageService.set('line.11','{ "id":11,"name": "Le zèbre", "latitude": 43.138010, "longitude": 6.102571, "grade": "7b", "site": 1, "sector": 3}');
    localStorageService.set('line.12','{ "id":12,"name": "Le facomochère", "latitude": 43.138010, "longitude": 6.102571, "grade": "7a", "site": 1, "sector": 3}');
    localStorageService.set('line.13','{ "id":13,"name": "Lart et la technique", "latitude": 43.138010, "longitude": 6.102571, "grade": "7a+", "site": 1, "sector": 3}');
                 
    //lines Gordolasque/Parking
    localStorageService.set('line.14','{ "id":14,"name": "I am not down", "latitude": 44.074160, "longitude": 7.400161, "grade": "7a+", "site": 2, "sector": 4}');
    localStorageService.set('line.15','{ "id":15,"name": "Hypo Canette", "latitude": 44.074160, "longitude": 7.400161, "grade": "7b+", "site": 2, "sector": 4}');
    
    //lines Gordolasque/Chaos
    localStorageService.set('line.16','{ "id":16,"name": "Kick parade", "latitude": 44.077724, "longitude": 7.401964, "grade": "7a+", "site": 2, "sector": 5}');
    localStorageService.set('line.17','{ "id":17,"name": "Canabis street", "latitude": 44.077724, "longitude": 7.401964, "grade": "7c", "site": 2, "sector": 5}');

    //lines Roquebrune/Cascade
    localStorageService.set('line.18','{ "id":18,"name": "Zion", "latitude": 43.455697, "longitude": 6.601392, "images": ["1.jpg", "2.jpg"], "grade": "7b", "site": 3, "sector": 6}');
    localStorageService.set('line.19','{ "id":19,"name": "Death in Vegas", "latitude": 43.455697, "longitude": 6.601392, "grade": "7b+", "site": 3, "sector": 6}');
    localStorageService.set('line.20','{ "id":20,"name": "Fermeture éclair", "latitude": 43.455697, "longitude": 6.601392, "grade": "7c", "site": 3, "sector": 6}');
    localStorageService.set('line.21','{ "id":21,"name": "Electric umbrella", "latitude": 43.455697, "longitude": 6.601392, "grade": "8a", "site": 3, "sector": 6}');
    localStorageService.set('line.22','{ "id":22,"name": "Lavande sauvage", "latitude": 43.455697, "longitude": 6.601392, "grade": "7a", "site": 3, "sector": 6}');
    localStorageService.set('line.23','{ "id":23,"name": "Bloc a bloc", "latitude": 43.455697, "longitude": 6.601392, "grade": "6c", "site": 3, "sector": 6}');
    localStorageService.set('line.24','{ "id":24,"name": "La force de tenebres", "latitude": 43.455697, "longitude": 6.601392, "grade": "6c", "site": 3, "sector": "6"}');
    localStorageService.set('line.25','{ "id":25,"name": "Solitude", "latitude": 43.455697, "longitude": 6.601392, "grade": "6c+", "site": 3, "sector": 6}');
                 
    //lines Roquebrune/Chapelle
    localStorageService.set('line.26','{ "id":26,"name": "La desmonta", "latitude": 43.458971, "longitude": 6.592596, "grade": "7b", "site": 3, "sector": 7}');
    localStorageService.set('line.27','{ "id":27,"name": "Nonobstant", "latitude": 43.458971, "longitude": 6.592596, "grade": "7b", "site": 3, "sector": 7}');
    localStorageService.set('line.28','{ "id":28,"name": "Chocapic", "latitude": 43.458971, "longitude": 6.592596, "grade": "7a+", "site": 3, "sector": 7}');
    localStorageService.set('line.29','{ "id":29,"name": "La trav de Comete", "latitude": 43.458971, "longitude": 6.592596, "grade": "7a", "site": 3, "sector": 7}');
    localStorageService.set('line.30','{ "id":30,"name": "Grand Bras", "latitude": 43.458971, "longitude": 6.592596, "grade": "7b+", "site": 3, "sector": 7}');
    localStorageService.set('line.31','{ "id":31,"name": "Ls Iwork", "latitude": 43.458971, "longitude": 6.592596, "grade": "7c", "site": 3, "sector": 7}');
    localStorageService.set('line.32','{ "id":32,"name": "Le tenia", "latitude": 43.458971, "longitude": 6.592596, "grade": "7b", "site": 3, "sector": 7}');
});



myApp.controller('SiteListCtrl', function($scope, $location, localStorageService, $webSql) {

    db.selectAll("sites").then(function(results) {
        $scope.sites = [];
        for(i=0; i < results.rows.length; i++){
                $scope.sites.push(results.rows.item(i));
        }
    });
                 
	
	$scope.detail = function(siteId) {
		$location.path('/site/' + siteId);
	};
});


                 
myApp.controller('SiteDetailCtrl', function($scope, $routeParams, $location, localStorageService, $webSql) {
    
    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
	id = parseInt($routeParams.siteId);
                    var sita = localStorageService.get('site.'+ id); // nécessaire pour la map mais devrait être remplacé par les coordonnées du sector actuel
                 $scope.site = {};
    db.select("sites", { "id": { "value": id}}).then(function(results) { $scope.site = results.rows.item(0);

	
                 
	/* Get child sector */
                 
    $scope.sectors = [];
    db.select("sectors",{"site":{"value":id}}).then(function(results) {
      for(var i=0; i < results.rows.length; i++){
            $scope.sectors.push(results.rows.item(i));
        }
    
                 
                 
                 
    
    /* Get child parkings */
    $scope.parkings = [];
    $scope.map = {};
    db.selectAll("parkings").then(function(results) {
                
                for(var i=0; i < results.rows.length; i++){
                        $scope.parkings.push(results.rows.item(i));
                };
    
    makeMap();
    });
    }); // sector
    }); // site
    
                 
                 
    makeMap = function() {
        $scope.map = { center: { latitude: sita.latitude, longitude: sita.longitude }, zoom: 16 };
        $scope.mapState = true;
    };
                 
    $scope.lineList = function(siteId,sectorId) {
            $location.path('/site/' + siteId + '/sector/' + sectorId);
    };
});



myApp.controller('SectorCtrl', function($scope, $routeParams, $location, $filter, localStorageService, $webSql) {
    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
    id = parseInt($routeParams.siteId);
    idd = parseInt($routeParams.sectorId);
    var sita = localStorageService.get('site.'+ id); // nécessaire pour la map mais devrait être remplacé par les coordonnées du sector actuel
    
    $scope.currency = idd;
                 
    $filtering = function(items,x) {
        $result = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(item.sector === x) { $result.push(item); }
        }
        return $result;
    };
                 
    $scope.site = {};
    $scope.list = [];
    $scope.lines = [];
    $scope.sectors = [];
    db.select("sites", { "id": { "value": id}}).then(function(results) { $scope.site = results.rows.item(0);
                 

    
    /* Get child sector */
    db.select("sectors",{"site":{"value":id}}).then(function(results) {
        for(var i=0; i < results.rows.length; i++){
            $scope.sectors.push(results.rows.item(i));
        }
    

                
                
    
    /* Get child line */

    db.select("lines",{"site":{"value":id}}).then(function(results) {
        for(var i=0; i < results.rows.length; i++){
            $scope.list.push(results.rows.item(i));
            if(results.rows.item(i).sector == idd){
                $scope.lines.push(results.rows.item(i));
            }
        }
                                                  
    makeMap();
    });
    });
    });
                 
                 
                 
    $scope.select = function(xid) {
        if(xid === 0){
            $scope.current = { "id":0,"name": "Toutes les voies"};
            $scope.lines = $scope.list;
        }
        else{
            $scope.current = {};
            db.select("sectors", { "id": { "value": xid}}).then(function(results) { $scope.current = results.rows.item(0);});
            $scope.lines = $filtering($scope.list,xid);
        }
    };

                
                 
    makeMap = function() {
        $scope.map = { center: { latitude: sita.latitude, longitude: sita.longitude }, zoom: 16 };
        $scope.mapState = true;
    };
                 
    $scope.maping = function(siteId,sectorId) {
        $location.path('/site/' + siteId + '/map/' + sectorId);
    };
    $scope.listing = function(siteId,sectorId) {
        $location.path('/site/' + siteId + '/sector/' + sectorId);
    };
    $scope.detail = function(lineId) {
        $location.path('/line/' + lineId);
    };
    $scope.back = function(siteId) {
        $location.path('/site/' + siteId);
    };
                 
                 
});



myApp.controller('LineDetailCtrl', function($scope, $routeParams, $location, localStorageService, $webSql, $filter) {
	id = parseInt($routeParams.lineId);
	
    $scope.line = {};
    db.select("lines", { "id": { "value": id}}).then(function(results) { $scope.line = results.rows.item(0); });

    $scope.backSector = function(siteId,sectorId) {
            $location.path('/site/' + siteId + '/sector/' + sectorId);
    };
	                     
});


myApp.controller('addCtrl', function($scope, $location, localStorageService) {
    

    $scope.sites = [];
    //This should be factorize in local storage?
    hasNext = true;
    i = 1;
    while(hasNext){
        $scope.sites[i] = localStorageService.get('site.' + i);
        $scope.sites[i].type = "site";
        i++;
        if(localStorageService.get('site.' + i) === null) {
            hasNext = false;
        }
    }
    
    $scope.sectors = [];
    //This should be factorize in local storage?
    hasNext = true;
    i = 1;
    while(hasNext){
        $scope.sectors[i] = localStorageService.get('sector.' + i);
        $scope.sectors[i].type = "sector";
        i++;
        if(localStorageService.get('sector.' + i) === null) {
             hasNext = false;
        }
    }

                 $scope.myPictures = [];
                 $scope.$watch('myPicture', function(value) {
                               if(value) {
                               myPictures.push(value);
                               }
                               }, true);
                 
                 
});

myApp.controller('searchCtrl', function($scope, $location, localStorageService) {
    $scope.title	= 'Search';
    $scope.message	= 'En dévelopement';
    $scope.activeType = "all";
    $scope.setSearchType = function (activeType) {
                 $scope.activeType = activeType;
    };
                 
    $scope.sites = [];
    //This should be factorize in local storage?
    hasNext = true;
    i = 1;
    while(hasNext){
        
        $scope.sites[i-1] = localStorageService.get('site.' + i);
        $scope.sites[i-1].type = "site";
        i++;
        if(localStorageService.get('site.' + i) === null) {
            hasNext = false;
        }
    }
                 
             
    $scope.lines = [];
    hasNext = true;
    i = 1;
                 
    while(hasNext){
        $scope.lines[i-1] = localStorageService.get('line.' + i);
        currentsite = localStorageService.get('site.' + $scope.lines[i-1].site);
        $scope.lines[i-1].sitename = currentsite.name;
        
        i++;
        if(localStorageService.get('line.' + i) === null) {
            hasNext = false;
        }
    }
    
    $scope.detailSite = function(siteId) { $location.path('/site/' + siteId); };
    $scope.detailLine = function(lineId) { $location.path('/line/' + lineId); };
});

myApp.controller('photoCtrl', function($scope, $rootScope) {
                 
        navigator.camera.getPicture(function(imagePath){
                                             document.getElementById("photoImg").setAttribute("src", imagePath);
                                             }, function(){
                                             alert("Photo cancelled");
                                             }, {
                                             destinationType: navigator.camera.DestinationType.FILE_URI
            });

});

myApp.controller('dbCtrl', function($scope, $webSql) {
    


                 
    db.selectAll("sites").then(function(results) {
        $scope.sites = [];
        alert(results.rows.length);
        for(i=0; i < results.rows.length; i++){
            $scope.sites.push(results.rows.item(i));
        }
    });
    db.selectAll("sectors").then(function(results) {
        $scope.sectors = [];
        alert(results.rows.length);
        for(i=0; i < results.rows.length; i++){
            $scope.sectors.push(results.rows.item(i));
        }
    });
    db.selectAll("lines").then(function(results) {
        $scope.lines = [];
        alert(results.rows.length);
        for(i=0; i < results.rows.length; i++){
            $scope.lines.push(results.rows.item(i));
        }
    });
                 
                 
    db.selectAll("parkings").then(function(results) {
        $scope.parkings = [];
        alert(results.rows.length);
        for(i=0; i < results.rows.length; i++){
            $scope.parkings.push(results.rows.item(i));
        }
    });
                 
   /* $scope.db.select("lines", { "site": { "value": 1, "union": 'AND'}, "sector": {"value": 2}}).then(function(results) {
            $scope.lines = [];
            for(i=0; i < results.rows.length; i++){
                $scope.lines.push(results.rows.item(i));
            }
    }); */

                 
});

myApp.controller('aboutCtrl', function($scope, $rootScope) {
	$scope.title	= 'A propos';
	$scope.message	= 'Help page';
	
});