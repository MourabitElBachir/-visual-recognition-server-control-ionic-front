Starting our Ionic Images App


    ionic start visual-recognition-ionic
    cd visual-recognition-ionic
    npm install --save @ionic-native/camera @ionic-native/file @ionic-native/file-path @ionic-native/transfer
    ionic plugin add cordova-plugin-camera --save
    ionic plugin add cordova-plugin-camera --save
    ionic plugin add cordova-plugin-camera --save
    ionic plugin add cordova-plugin-file --save
    ionic plugin add cordova-plugin-file-transfer --save
    ionic plugin add cordova-plugin-filepath --save`


In detail these plugins are used for:

- **cordova-plugin-camera:** `Needed for using the Ionic native camera`
- **cordova-plugin-file:** `Needed for copying the result of the camera into our filesystem`
- **cordova-plugin-file-transfer:** `Needed for uploading files`
- **cordova-plugin-filepath:** `Utility for fixing some Android paths to files`




