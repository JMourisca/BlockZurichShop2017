// Define the `phonecatApp` module
var app = angular.module('app', ['ui.bootstrap', 'ngSanitize']);

// Define the `PhoneListController` controller on the `phonecatApp` module
app.controller('ProductsController', function PhoneListController($scope, $uibModal, $log, $http) {

    var $ctrl = this;

    $ctrl.articles = [];
    $ctrl.exchange = 1;

    $http.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,EUR").then(
        function (res) {
            $ctrl.exchange = res.data["EUR"];
        }
    );

    $http.get("https://api.siroop.ch/product/search/?query=1046629-A&limit=20&apikey=8ccd66bb1265472cbf8bed4458af4b07").then(
        function (res) {
            $ctrl.articles[1] = res.data[0];
        }
    );
}).controller('ModalInstanceCtrl', function ($uibModalInstance, $log, $http, $uibModal, selected_article) {
    var $ctrl = this;
    $ctrl.loading = false;
    $ctrl.selected_article = selected_article;
    $ctrl.amount = 1;

    // Uport connection - display QRCode
    var uportconnect = window.uportconnect;

    const uport = new uportconnect.Connect('Juliana\'s new app', {
        clientId: '2odUiw5GfTvpNAMuGgLoxYvydLfzHbSytBw',
        network: 'rinkeby',
        signer: uportconnect.SimpleSigner('6bfb53228fdc0511e3af337a7d2dda5fcf57a19e98467b9554056bf7db909bdd')
    });

    uport.requestCredentials(
        {
            requested: ['name', 'phone', 'email'],
            notifications: true
        },
        (credentials) => {
            const qr = kjua({
                text: credentials,
                size: 400,
                fill: "#816263"
            });

            document.getElementById("qrcode").appendChild(qr);
        }
    ).then(
        (credentials) => {
            var data = {
                "credentials": credentials,
                "amount": document.getElementById("amount").value
            };
            $.ajax({
                type: 'POST',
                url: "http://localhost:5000/confirm_purchase",
                data: data,

                error: function (e) {
                    $log.error("Something went wrong");
                    $ctrl.cancel();
                },
                dataType: "json",
                contentType: "application/json"
            }).done(function (res) {
                $ctrl.ok(res);
            });
    });
    // END OF UPORT CONNECT

    $ctrl.ok = function (res) {
        $uibModalInstance.close($ctrl.selected_article.name);

        $ctrl.open = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalConfirmation.html',
                controller: 'ModalConfirmationCtrl',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem,
                resolve: {
                    response: function () {
                        return res;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $ctrl.open();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}).controller('ModalConfirmationCtrl', function ($uibModalInstance, $log, $http, response) {
    var $ctrl = this;

    $ctrl.response = response;

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}).component("articleBox", {
    templateUrl: "templates/article.html",
    bindings: {
        exchange: "<",
        sku: "@"
    },
    controller: function ArticleBoxController($uibModal, $log, $http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            if ($ctrl.sku != undefined && $ctrl.sku !== "") {
                $http.get("https://api.siroop.ch/product/concretes/sku/" + $ctrl.sku + "?apikey=8ccd66bb1265472cbf8bed4458af4b07").then(
                    function (res) {
                        $ctrl.article = res.data[0];
                        $ctrl.article["exchange"] = $ctrl.exchange;
                    }
                );
            } else {
                $ctrl.article = {
                    name: "Blutige Zombie Krankenschwester Halloween Plus Size Damenkostüm rot-weiss",
                    url: "http://www.karneval-megastore.de/blutige-zombie-krankenschwester-halloween-plus-size-damenkostuem-rot-weiss.html",
                    price: 2899,
                    images: {
                        highres: "images/p3.jpg"
                    },
                    description: "",
                    tags: [],
                    exchange: $ctrl.exchange
                };
            }
        };

        $ctrl.buy = function () {
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
                            return $ctrl.article;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $ctrl.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $ctrl.open();
        };
    }
});
