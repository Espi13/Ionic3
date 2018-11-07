import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  GoogleMaps,  GoogleMap,  GoogleMapsEvent,   GoogleMapOptions,  Marker,   Environment } from '@ionic-native/google-maps';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  map: GoogleMap;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }
  loadMap() {

    // This code is necessary for browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyDbUTqEcIkrsz7ADfVvCqNtpM_NA9k7VIw',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyDbUTqEcIkrsz7ADfVvCqNtpM_NA9k7VIw'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 35.90039,
           lng:  14.51684
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'My shop',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 35.90039,
        lng: 14.51684
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }
}
