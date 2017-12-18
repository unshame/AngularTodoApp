app.filter('taskFilter', function() {
	return function($scope) {
		var filter = $scope.filter;
		return $scope.tasks.filter(function(task) {
			return 
			(      // Фильтруем по введенному тексту
				!filter.searchFor ||
				task.data.text.toLowerCase().includes(
					filter.searchFor.toLowerCase()
				)
			) && ( // Фильтруем тому, отмечен ли таск
				filter.display == 'Any' ||
				filter.display == 'Active' && !task.data.done ||
				filter.display == 'Complete' && task.data.done
			) && ( // Фильтруем по лейблу
				$scope.labelIsShown(task.data.label)
			);
		});
	};
});
