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

// Добавляет цвета лейблам при выборе
app.directive('labelColors', function () {
  return {
    require: 'select',
    link: function(scope, elem, attrs, ngSelect) {
        scope.$watch('labels', function(items) {
            scope.labels.forEach(function(label) {
                var options = elem.find('option');
                // По какой-то причине 'option[label]' не срабатывает
                for(var i = 0; i < options.length; i++){
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