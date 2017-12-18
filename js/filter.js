app.filter('taskFilter', function() {
	return function($scope) {
		var filter = $scope.filter;
		return $scope.tasks.filter(function(task) {
			return (
				!filter.searchFor ||
				task.data.text.toLowerCase().includes(
					filter.searchFor.toLowerCase()
				)
			) && (
				filter.display == 'Any' ||
				filter.display == 'Active' && !task.data.done ||
				filter.display == 'Complete' && task.data.done
			) && (
				$scope.labelIsShown(task.data.label)
			);
		});
	};
});
