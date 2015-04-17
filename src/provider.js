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
                options.align = "horizontal"
            }

            if (!options.view) {
                options.view = "buyer"
            }

            if (!options.emailhash) {
                options.emailhash = "9999999"
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
                    name: "Arnav34",
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

