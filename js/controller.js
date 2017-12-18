var app = angular.module('taskApp', []);
let storageKeyTasks = 'taskStorage';
let storageKeyLabels = 'labelStorage';
let storageKeyDrawer = 'drawerStorage';


var tasks, tasksData, tasksFiltered, labels;
var newTask, filter, stats, displaySettings;
app.controller('taskController', function($scope, $filter) {
	
	function createTask(data, label) {
		return {
			data: data, // {text: string, done: bool, label: string}
			editedText: data.text,
			editing: false
		};
	}

	function createLabel(key, color) {
		return {
			key: key,
			color: color,
			show: true
		};
	}

	var defaultTasks = [
		{
			text: 'Make an app',
			done: true,
			label: null
		},
		{
			text: '??????',
			done: false,
			label: null
		},
		{
			text: 'Something',
			done: false,
			label: 'Important'
		}
	];

	var defaultLabels = [
		createLabel('Important', 'blue'),
		createLabel('Purple', 'purple'),
		createLabel('Urgent', 'red'),
		createLabel('Something', 'orange')
	]

	tasks = $scope.tasks = [];
	tasksData = $scope.tasksData = getStoredArrayItem(storageKeyTasks, defaultTasks);
	labels = $scope.labels = getStoredArrayItem(storageKeyLabels, defaultLabels);

	$scope.newLabel = '';

	newTask = $scope.newTask = {
		text: '',
		label: ''
	};

	stats = $scope.stats = {
		shown: 0,
		remaining: 0,
		complete: 0,
		hidden: 0,
		allChecked: false,
		allCheckedAndNotEmpty: false
	};

	displaySettings = $scope.displaySettings = [
		'All',
		'Active',
		'Complete'
	];

	filter = $scope.filter = {
		showLabelless: true,
		searchFor: '',
		display: displaySettings[0]
	};

	var defaultLabelColors = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'aquamarine'];
	var labelColors = $scope.labelColors = defaultLabelColors.slice();
	labels.forEach(function(label) {
		var i = labelColors.indexOf(label.color);
		if(~i){
			labelColors.splice(i, 1);
		}
	});

	function addLabel() {
		if(labelColors.length == 0 || !$scope.newLabel) return;
		labels.push(createLabel($scope.newLabel, labelColors[0]))
		labelColors.splice(0, 1);
		newTask.label = $scope.newLabel;
		$scope.newLabel = '';
	}
	$scope.addLabel = addLabel;

	function deleteLabel(label) {
		var i = labels.indexOf(label);
		if(!~i) return;
		var ii = defaultLabelColors.indexOf(label.color);
		if(~ii){
			labelColors.push(label.color);
		}
		deleteTasksWithLabel(label.key);
		if(newTask.label == label.key){
			newTask.label = '';
		}
		labels.splice(i, 1);
	}
	$scope.deleteLabel = deleteLabel;

	function getLabelByKey(key){
		if(!key) return null;

		return labels.find(function(label){
			return label.key == key;
		}) || null;
	}
	$scope.getLabelByKey = getLabelByKey;

	function getLabelColor(key) {
		var label = getLabelByKey(key);
		if(label){
			return label.color;
		}
		else{
			return 'gray';
		}
	}
	$scope.getLabelColor = getLabelColor;

	function labelIsShown(key) {
		var label = getLabelByKey(key);
		console.log(label)
		if(label) {
			return label.show;
		}
		else {
			return filter.showLabelless;
		}
	}
	$scope.labelIsShown = labelIsShown;

	function addTask() {
		if(!newTask.text) return;


		var task = createTask({
			text: newTask.text,
			label: newTask.label,
			done: false
		});
		tasks.push(task);
		tasksData.push(task.data);

		newTask.text = '';
	}
	$scope.addTask = addTask;

	function deleteTask(task) {
		var i = tasks.indexOf(task);
		if(!~i) return;
		tasks.splice(i, 1);
		tasksData.splice(i, 1);
	}
	$scope.deleteTask = deleteTask;

	function deleteCompleteShownTasks() {
		tasksFiltered.forEach(function(task) {
			if(task.data.done){
				deleteTask(task);
			}
		});
	}
	$scope.deleteCompleteShownTasks = deleteCompleteShownTasks;

	function deleteTasksWithLabel(label) {
		tasks.forEach(function(task) {
			if(task.data.label == label) {
				deleteTask(task);
			}
		});
	}
	$scope.deleteTasksWithLabel = deleteTasksWithLabel;

	function editTask(task) {
		task.editing = true;
	}
	$scope.editTask = editTask;

	function revertTask(task) {
		task.editing = false;
		task.editedText = task.data.text;
	}
	$scope.revertTask = revertTask;

	function changeTask(task) {
		task.editing = false;
		if(!task.editedText){
			deleteTask(task);
			return;
		}
		task.data.text = task.editedText;
	}
	$scope.changeTask = changeTask;

	function getFilteredTasks() {
		return $filter('taskFilter')($scope);
	}

	function filterTasks() {
		tasksFiltered = $scope.tasksFiltered = getFilteredTasks();
		stats.shown = tasksFiltered.length;
		stats.remainingTotal = tasks.filter(function(task) {
			return !task.data.done
		}).length;
		stats.remaining = tasksFiltered.filter(function(task) {
			return !task.data.done
		}).length;
		stats.complete = stats.shown - stats.remaining;
		stats.allChecked = stats.remaining == 0;
		stats.hidden = tasks.length - stats.shown;

		stats.info = 'Showing ';
		if(stats.hidden === 0){
			if(tasks.length == 1) {
				stats.info += 'the only task';
			}
			else {
				stats.info += 'all ' + tasks.length + ' tasks';
			}
		}
		else{
			stats.info += stats.shown + ' out of ' + tasks.length + 
			(stats.shown == 1 ? ' task' : ' tasks');
		}

		if(stats.remainingTotal === 0){
			stats.remainingInfo = 'All is done!'
		}
		else{
			stats.remainingInfo = stats.remainingTotal + 
			(stats.remainingTotal == 1 ? ' task' : ' tasks') + ' left';
		}
	}

	function resetFilters(){
		filter.showLabelless = true;
		filter.searchFor = '';
		filter.display = displaySettings[0];
		labels.forEach(function(label) {
			label.show = true;
		})
	}
	$scope.resetFilters = resetFilters;

	function toggleFiltered() {
		tasksFiltered.forEach(function(task) {
			task.data.done = !stats.allChecked;
		});
		filterTasks();
	}
	$scope.toggleFiltered = toggleFiltered;

	function saveTasks() {
		setStoredItem(storageKeyTasks, tasksData);
	};

	function saveLabels() {
		setStoredItem(storageKeyLabels, labels);
	}


	$scope.drawerOpened = getStoredItem(storageKeyDrawer) || false;


	tasksData.forEach(function(data){
		tasks.push(createTask(data));
	});

	$scope.$watch('[tasks, filter]', function() {
		filterTasks();
	}, true);

	$scope.$watch('tasksData', function() {
		saveTasks();
	}, true);

	$scope.$watch('labels', function() {
		filterTasks();
		saveLabels();
	}, true);

	$scope.$watch('drawerOpened', function() {
		setStoredItem(storageKeyDrawer, $scope.drawerOpened);
	});

});
