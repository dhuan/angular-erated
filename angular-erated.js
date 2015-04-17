angular
    .module('angular-erated', ['angularLoad']);

angular
    .module('angular-erated')
    .provider('eratedService', [eratedServiceProvider]);

function eratedServiceProvider() {
    var apiKey = "";

    this.setApiKey = function(key) {
        apiKey = key;
    }

    this.$get = ['angularLoad', function(angularLoad) {
        var service = {
            apiKey: apiKey,
            loadSetupScript: loadSetupScript,
            setupVars: setupVars
        };

        return service;

        function loadSetupScript() {
            angularLoad.loadScript('//cdn.erated.co/iframe/erated_imp.js');
        }

        function setupVars(options) {
            if (typeof options == "undefined") {
                options = {};
            }

            if (!options.align) {
                options.align = "horizontal";
            }

            if (!options.view) {
                options.view = "buyer";
            }

            if (!options.emailhash) {
                options.emailhash = "9999999";
            }

            if (!options.username) {
                options.username = "username";
            }

            reviews = [];

            window.eRated = {
                config: {
                    align: options.align,
                    key: apiKey,
                    color: "#45b66d",
                    purchaseId: "make_an_offer",
                    reputationMode: "marketplace",
                    privacy: {
                    firstNameOnly: false
                    },
                    view: options.view,
                    type: "html",
                    width: 380
                },
                userData: {
                    name: options.username,
                    sha1Email: options.emailhash,
                    location: "",
                    image: "http://sidelineswap.com/system/images/138377/thumb/602865_346126212166380_1961619082_n.jpg",
                    reputationData: {
                        numberOfReviews: 0,
                        percentPositiveReviews: 0,
                        reviews: reviews
                    }
                }
            }
        }
    }];
}


angular
    .module('angular-erated')
    .directive('eratedplugin', ['eratedService', eratedPlugin]);

function eratedPlugin(eratedService) {
    var templateContent = '<div class="erated horizontal"></div>';

    return {
        restrict: 'EA',
        link: function($scope, $element, attr) {
            var options = {};

            if(attr.align) {
                options.align = attr.align;
            }

            if(attr.view) {
                options.view = attr.view;
            }

            if(attr.emailhash) {
                options.emailhash = attr.emailhash;
            }

            if(attr.username) {
                options.username = attr.username;
            }

            eratedService.loadSetupScript();
            eratedService.setupVars(options);
        },
        template: templateContent
    };
}
