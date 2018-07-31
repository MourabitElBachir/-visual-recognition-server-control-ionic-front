import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController,
  Platform, LoadingController, Loading } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { HTTP } from '@ionic-native/http';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lastImage: string = null;
  loading: Loading;
  disableUpload = true;

  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File,
              private filePath: FilePath, public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
              private http: HTTP) { }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

// Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = this.gen() + this.gen() + n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.disableUpload = false;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public downloadFile(url, outputImgName) {

    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.download(url, cordova.file.dataDirectory + outputImgName).then((entry) => {

      //delete request here for: upload, output
      this.http.get('http://10.33.171.5:5005/api/removeFiles/'+this.lastImage, {}, {})
        .then(data => {
          console.log(data.status);
          console.log(data.data); // data received by server
          console.log(data.headers);
        })
        .catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

      this.lastImage = outputImgName;
      this.disableUpload = true;

      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      this.presentToast('Error while displaying image.');
    });

  }

  public downloadOutputImage(url) {
    const outputImgName = this.createFileName();
    this.file.removeFile(cordova.file.dataDirectory, outputImgName).then(_ => {
      console.log('removed exists');
      this.downloadFile(url, outputImgName);
    }).catch(err => {
      console.log('File doesn\'t exist');
      this.downloadFile(url, outputImgName);
    });
  }

// Upload an image to server code
  public uploadImage() {
    // Destination URL
    var url = "http://10.33.171.5:5005/api/upload_image";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Uploading & Recognizing ...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {

      let filePathImg = 'http://10.33.171.5:5005/api/uploads/'+filename;
      this.downloadOutputImage(filePathImg)

      this.loading.dismissAll()
      this.presentToast('Image successfully recognized.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  public gen(): string {
    return Math.random().toString(16).slice(-4);
  }
}
