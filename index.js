/** Read FAQs section on the left for more information on how to use the editor */
const SAMPLE_FEATURES = {
    show_dialog_box: true,
    enable_new_pricing: true
}

const Cache = {
    featureFlags: {},
    timeStamp: null
};
const MAX_CACHE_TTL = 100000;
let fetchInstance = null;

// return the state of all features for the current user
function fetchAllFeatures() {
    console.log("Call to BE");
    // mocking the fetch API Call
    return new Promise((resolve) => {
        setTimeout(() => resolve(SAMPLE_FEATURES), 100);
    });
}

// DO NOT CHANGE THE FUNCTION NAME
function getFeatureState(featureName, defaultValue) {
    const isCacheDataPresent = Object.keys(Cache.featureFlags).length;
    const isCacheDataFresh = Date.now() - Cache.timeStamp < MAX_CACHE_TTL;

    if (isCacheDataFresh && isCacheDataPresent) {
        console.log("Returning from Cache", featureName);
        const value = Object.prototype.hasOwnProperty.call(Cache.featureFlags, featureName) 
            ? Cache.featureFlags[featureName]
            : defaultValue;
        
        return Promise.resolve(value);
    }

    if (fetchInstance instanceof Promise) {
        return fetchInstance
        .then((featureFlags) => {
            console.log("From Promise callback", featureName);
            return Object.prototype.hasOwnProperty.call(featureFlags, featureName)
                ? featureFlags[featureName]
                : defaultValue;
        }).catch(() => defaultValue);
    }

    // write your solution here
    fetchInstance = fetchAllFeatures()
        .then (featureFlags => {
            Cache.featureFlags = featureFlags;
            Cache.timeStamp = Date.now();

            return Object.prototype.hasOwnProperty.call(featureFlags, featureName)
            ? featureFlags[featureName]
            : defaultValue;
        })
        .catch(() => defaultValue);

    return fetchInstance;
};

getFeatureState('show_dialog_box', false).then(function (isEnabled) {
    if (isEnabled) {
        console.log('show_dialog_box enabled');        
    } else {
        console.log('show_dialog_box disabled');
    }
});

getFeatureState('show_pricing_v2', false).then(function (isEnabled) {
    if (isEnabled) {
        console.log('show_pricing_v2 enabled');        
    } else {
        console.log('show_pricing_v2 disabled');
    }
});

getFeatureState('show_editor', false).then(function (isEnabled) {
    if (isEnabled) {
        console.log('show_editor enabled');        
    } else {
        console.log('show_editor disabled');
    }
});

// make the first call
// we get the data in 100 ms
// store
// next call after 300 ms
// return the value from cache

setTimeout(() => {
    getFeatureState('enable_new_pricing', false).then(function (isEnabled) {
        if (isEnabled) {
            console.log('enable_new_pricing enabled');        
        } else {
            console.log('enable_new_pricing disabled');
        }
    });
}, 300);