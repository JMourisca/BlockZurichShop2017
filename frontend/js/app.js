// Define the `phonecatApp` module
var app = angular.module('app', ['ui.bootstrap', 'ngSanitize']);

// Define the `PhoneListController` controller on the `phonecatApp` module
app.controller('ProductsController', function PhoneListController($scope, $uibModal, $log, $http) {

    var $ctrl = this;

    $ctrl.articles = [];
    $ctrl.exchange = 1;

    $http.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,EUR").then(
        function(res) {
            $ctrl.exchange = res.data["EUR"];
        }
    );

    $http.get("https://api.siroop.ch/product/search/?query=1021253-1&limit=20&apikey=8ccd66bb1265472cbf8bed4458af4b07").then(
        function (res) {
            $ctrl.articles[0] = res.data[0];
        }
    );

    $http.get("https://api.siroop.ch/product/search/?query=1046629-A&limit=20&apikey=8ccd66bb1265472cbf8bed4458af4b07").then(
        function (res) {
            $ctrl.articles[1] = res.data[0];
        }
    );

    $ctrl.articles[2] = {
            name: "Blutige Zombie Krankenschwester Halloween Plus Size Damenkostüm rot-weiss",
            url: "http://www.karneval-megastore.de/blutige-zombie-krankenschwester-halloween-plus-size-damenkostuem-rot-weiss.html"
        };

    $ctrl.buy = function (index) {
        $ctrl.open = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem,
                resolve: {
                    selected_article: function () {
                        return $ctrl.articles[index];
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $ctrl.open()
    };
}).controller('ModalInstanceCtrl', function ($uibModalInstance, $log, $http, selected_article) {
    var $ctrl = this;
    $ctrl.loading = true;
    $ctrl.selected_article = selected_article;

    $http.get("http://localhost:5000/test").then(function (res) {
        $ctrl.loading = false;
        return $ctrl.selected_article;
    });

    $log.info($ctrl.selected_article);

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected_article.name);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}).component("articleBox", {
    templateUrl: "templates/article.html",
    bindings: {
        article: "<",
        exchange: "<"
    },
    controller: function ArticleBoxController() {
        var ctrl = this;
        //ctrl.article = article;
    }
});