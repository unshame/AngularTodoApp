// Передает фокус на инпут, когда значение стало true
app.directive('getFocus', function($timeout) {
	return {
		scope: { trigger: '@getFocus' },
		link: function(scope, element) {
			scope.$watch('trigger', function(value) {
				if(value === "true") { 
					$timeout(function() {
						element[0].focus(); 
					});
				}
			});
		}
	};
});

// Инпут теряет фокус, когда значение стало true
app.directive('loseFocus', function($timeout) {
    return {
        scope: { trigger: '@loseFocus' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === "true") { 
                    $timeout(function() {
                        element[0].blur(); 
                    });
                }
            });
        }
    };
});

// Добавляет цвета лейблам при выборе
app.directive('labelColors', function () {
  return {
    require: 'select',
    link: function(scope, elem, attrs, ngSelect) {
        scope.$watch('labels', function(items) {
            scope.labels.forEach(function(label) {
                var options = elem.find('option');
                // По какой-то причине 'option[label]' не срабатывает
                for(var i = 1; i < options.length; i++){
                    var option = options[i];
                    if(option.label == label.key){ 
                        angular.element(option).addClass(label.color);
                        break;
                    }
                }
            });
        }, true);
    }
  };
});

// Вызывает указанную функцию по клику, передавая ей ивент
app.directive('clickDir', function($document, $parse, $timeout){
    return {
        restrict: 'A',
        link: function($scope, elem, attr) {
            $timeout(function() {
                function _hasTouch() {
                    // works on most browsers, IE10/11 and Surface
                    return 'ontouchstart' in window || navigator.maxTouchPoints;
                };

                function eventHandler(e){
                    $timeout(function() {
                        $scope[attr['clickDir']](e);
                    });
                }

                // if the devices has a touchscreen, listen for this event
                if (_hasTouch()) {
                    $document.on('touchstart', eventHandler);
                }

                // still listen for the click event even if there is touch to cater for touchscreen laptops
                $document.on('click', eventHandler);

                // when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
                $scope.$on('$destroy', function() {
                    if (_hasTouch()) {
                        $document.off('touchstart', eventHandler);
                    }

                    $document.off('click', eventHandler);
                });
            });
        }
    }
})
