angular.module("app", ["templates"])
  .factory('defaultData', function () {
    return {
      itemList: makeDefaultData(),
      itemSelected: { value: null }
    }
  })
  .controller('ContentViewCtrl', ['$scope', 'defaultData', function ($scope, defaultData) {

    const DATE_KEY = 'date'
    const TITLE_KEY = 'title'
    const SEARCH_EMPTY = ''
    const EMPTY_TITLE = ''
    const HIDE_TIME = false

    $scope.model = {
      sort: TITLE_KEY,
      hideTime: HIDE_TIME,
      searchString: SEARCH_EMPTY,
      newTitle: EMPTY_TITLE
    }

    // function to compare by date
    sortByDate = (a, b) => {
      return new Date(a) - new Date(b)
    }

    // function to compare by string value
    sortByText = (a, b) => {
      if (b > a) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    }

    // function to sort
    sortData = (a, b) => {
      if ($scope.model.sort === TITLE_KEY) {
        return sortByText(a.title, b.title)
      }
      if ($scope.model.sort === DATE_KEY) {
        return sortByDate(a.date, b.date)
      }
    }

    // filter
    filterData = (item) => {
      if (!$scope.model.searchString) {
        return true
      } else if ($scope.model.searchString.toLowerCase() === item.title.toLowerCase()) {
        return true
      }
      return false
    }
    // returns sorted and filtered items list
    $scope.getItemList = () => {
      return defaultData.itemList.sort(sortData).filter(filterData)
    }
    // add a new item
    $scope.addItem = () => {
      const newItem = {
        id: makeDataId(),
        title: $scope.model.newTitle,
        tags: [],
        date: new Date(),
      }
      if ($scope.model.newTitle) {
        defaultData.itemList.push(newItem)
        $scope.model.newTitle = EMPTY_TITLE
      }
    }
    // say to service which item chosen
    $scope.selectItem = (i) => {
      defaultData.itemSelected.value = i
    }

  }])
  .controller('SidebarViewCtrl', ['$scope', 'defaultData', function ($scope, defaultData) {
    const EMPTY_TAG = ''

    $scope.model = {
      tagName: EMPTY_TAG
    }

    $scope.selected = defaultData.itemSelected

    $scope.selectItem = () => {
      return defaultData.itemList[$scope.selected.value]
    }

    $scope.removeTag = (index) => {
      $scope.selectItem().tags.splice(index, 1)
    }

    $scope.addTag = () => {
      if ($scope.model.tagName) {
        $scope.selectItem().tags.push($scope.model.tagName)
        $scope.model.tagName = ''
      }
    }

  }])
  .controller('SummaryViewCtrl', ['$scope', 'defaultData', function ($scope, defaultData) {

    $scope.getLastValue = () => {
      const sorted = defaultData.itemList.sort((a, b) => {return new Date(a) - new Date(b)})
      return sorted[sorted.length - 1]
    }

    makeTaglist = (data) => {
      const arrays = data.itemList.map((item) => item.tags)
      const merged = [].concat.apply([], arrays)
      return [...new Set(merged)].sort(sortByText)
    }

    $scope.getTagsList = () => {
      return makeTaglist(defaultData)
    }

  }])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
    };
  })
  .directive("contentView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
    };
  })
  .directive("sidebarView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
    };
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };

    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${ width }px`);
      };
      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-2></some-2>",
    };
  })
  .directive("some2", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-3></some-3>",
    };
  })
  .directive("some3", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<summary-view></summary-view>",
    };
  })
  .directive("summaryView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
    };
  });

