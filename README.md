1- Configure your TensorFlow Object Detection API + Start the Python WEB SERVER

  Repository link for the Python server detection API : [Repository of Python Tensorflow Server](https://gitlab-lyon.sqli.com/ebmourabit/visual-recognition-server-control-ionic-back)
  

2- Starting our Ionic Images App

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

3- Connect IONIC to the Python server WEB Services

Modify the value of the variable `serverURL` by your Python server IP address In the file : home.ts `[line : 21]`

    readonly serverURL : string = "http://10.33.171.5:5005";
