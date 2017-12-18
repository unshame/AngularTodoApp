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
