import { Component, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import {Values} from '../../providers/service/values';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
/**
 * Generated class for the OrdersDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var mapboxgl:any;

@Component({
  selector: 'page-orders-detail',
  templateUrl: 'orders-detail.html',
})
export class OrdersDetailPage  implements AfterViewInit{
  miLatitude = 0;
  miLongitude = 0;
  clientUi:any;
  nameClient:any;
  productUi:any;
  productName:any;
  status:any;
  date:any;
  hour:any;
  location:any;
  lat:any;
  lng:any;
  data:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, params:NavParams,  public values:Values,private nativeGeocoder: NativeGeocoder, private platform: Platform,private geolocation: Geolocation) {
    let orders = params.data
    this.lat = Number(orders.data[0].lat);
    this.lng = Number(orders.data[0].lng);
    this.data.push(orders.data[0])

    this.platform.ready().then(() => {
      // const subscription = this.geolocation.watchPosition()
      //   .filter((p) => p.coords !== undefined) //Filter Out Errors
      //   .subscribe(position => {
      //     this.miLatitude = position.coords.latitude;
      //     this.miLongitude = position.coords.longitude;
      //     console.log("miLocation=" + position.coords.latitude + ' ' + position.coords.longitude);
      //   });
      const subscription = this.geolocation.watchPosition().subscribe(position => {
        if ((position as Geoposition).coords != undefined) {
          var geoposition = (position as Geoposition);
          this.miLatitude = geoposition.coords.latitude;
          this.miLongitude = geoposition.coords.longitude;
          console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        } else {
          var positionError = (position as PositionError);
          console.log('Error ' + positionError.code + ': ' + positionError.message);
        }
      });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersDetailPage');
  }

  ngAfterViewInit(){
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9sYXM5MSIsImEiOiJja2l5YjZkbTUwdDlyMnltNmZmdmhuNGxsIn0.zShdGlc5rvqi1nxslqD7WA';
   
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });
    map.on('load', () => {
        map.resize();

        new mapboxgl.Marker()
          .setLngLat([this.lng, this.lat])
          .addTo(map);


          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
              'type': 'LineString',
                'coordinates': [
                  [this.miLongitude, this.miLatitude],
                  [this.lng, this.lat]
                ]
              }
            }
          });

          map.addLayer({
              'id': 'route',
              'type': 'line',
              'source': 'route',
              'layout': {
              'line-join': 'round',
              'line-cap': 'round'
              },
              'paint': {
              'line-color': '#ff0000',
              'line-width': 8
              }
            });

        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }

        map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',

              // use an 'interpolate' expression to add a smooth transition effect to the
              // buildings as the user zooms in
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
    });
  }

}
