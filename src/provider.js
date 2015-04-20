angular
    .module('angular-erated')
    .provider('eratedService', [eratedServiceProvider]);

function eratedServiceProvider() {
    var apiKey = "";

    this.setApiKey = function(key) {
        apiKey = key;
    }

    this.$get = ['$q', '$http', 'angularLoad', function($q, $http, angularLoad) {
        var service = {
            apiKey: apiKey,
            getApiKey: getApiKey,
            getUserProfile: getUserProfile,
            loadSetupScript: loadSetupScript,
            setupVars: setupVars
        };

        return service;

        function getApiKey() {
            return apiKey;
        }

        function getUserProfile(emailHash) {
            var deferred = $q.defer();

            $http.get('//api.erated.co/v1/users/'+emailHash+'?partner='+getApiKey())
                .success(function(data) {
                    deferred.resolve(data); 
                })
                .error(function(data, status) {
                    deferred.reject(data); 
                });

            return deferred.promise;
        }

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
                    color: options.color,
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
                    location: options.location,
                    image: options.image,
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

