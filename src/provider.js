angular
    .module('angular-erated')
    .provider('eratedService', [eratedServiceProvider]);

function eratedServiceProvider() {
    var apiKey = "";
    var defaultConfig = {};

    var reviews = [];

    this.setApiKey = function(key) {
        apiKey = key;
    }

    this.setDefaultConfig = function(config) {
        defaultConfig = config;
    }

    this.$get = ['$q', '$http', 'angularLoad', function($q, $http, angularLoad) {
        var service = {
            apiKey: apiKey,
            getApiKey: getApiKey,
            getUserProfile: getUserProfile,
            getDefaultConfig: getDefaultConfig,
            addReview: addReview,
            getReviews: getReviews,
            removeAllReviews: removeAllReviews,
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

        function getDefaultConfig() {
            return defaultConfig;
        }

        function addReview(content, asSeller, type) {
            reviews.push({
                review_content: content,
                reviewed_as_seller: asSeller,
                review_type: type,
            });
        }

        function getReviews() {
            return reviews;
        }

        function removeAllReviews() {
            reviews = [];
        }

        function loadSetupScript() {
            angularLoad.loadScript('//cdn.erated.co/iframe/erated_imp.js');
        }

        function setupVars(options) {
            var reviews = service.getReviews();

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

            var defaultConfig = service.getDefaultConfig();

            for(var key in defaultConfig) {
                window.eRated.config[key] = defaultConfig[key];
            }

            service.removeAllReviews();

            return window.eRated;
        }
    }];
}

