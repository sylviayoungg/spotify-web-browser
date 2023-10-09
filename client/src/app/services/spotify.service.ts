import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    return lastValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) =>{
      return response;
    },(err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    let sources: ResourceData[];
    let sourcesEncoded = encodeURIComponent(resource);
    return this.sendRequestToExpress('/search/'+category+'/'+sourcesEncoded).then((data) => {
      //console.log(data);
      if(category === "artist"){
        let sources: ArtistData[];
        sources = data['artists']['items'].map((artistRes) => {
          return new ArtistData(artistRes);
        });
        //console.log(sources);
        return sources;
      }
      if(category === "track"){
        let sources: TrackData[];
        sources = data['tracks']['items'].map((trackRes) => {
          return new TrackData(trackRes);
        });
        //console.log(sources);
        return sources;
      }
      if(category === "album"){
        let sources: AlbumData[];
        sources = data['albums']['items'].map((albumRes) => {
          return new AlbumData(albumRes);
        });
        return sources;
      }
      return sources;
    });
    //return null as any;
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    let idEncoded = encodeURIComponent(artistId);
    return this.sendRequestToExpress('/artist/'+idEncoded).then((data) => {
      //console.log(data);
      return new ArtistData(data);
    });
    //return null as any;
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    let relatedArtistInfo: ArtistData[];
    let relatedArtistIdEncoded = encodeURIComponent(artistId);
    return this.sendRequestToExpress('/artist-related-artists/'+relatedArtistIdEncoded).then((data) => {
      //console.log(data);
      relatedArtistInfo = data['artists'].map((res) => {
        return new ArtistData(res);
      });
      return relatedArtistInfo;
    });
   //return null as any;
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    let topTracksInfo: TrackData[];
    let topTrackIdEncoded = encodeURIComponent(artistId);
    return this.sendRequestToExpress('/artist-top-tracks/'+topTrackIdEncoded).then((data) => {
      //console.log(data);
      topTracksInfo = data['tracks'].map((res) => {
        return new TrackData(res);
      })
      return topTracksInfo;
    });
    //return null as any;
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    let artistAlbum: AlbumData[];
    let artistAlbumEncoded = encodeURIComponent(artistId);
    return this.sendRequestToExpress('/artist-albums/'+artistAlbumEncoded).then((data) => {
      // console.log(data);
      artistAlbum = data['items'].map((res) => {
        return new AlbumData(res);
      });
      return artistAlbum;
    });
    //return null as any;
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => {
      return new AlbumData(data);
    });
    // return null as any;
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      let key = "items";
      return data[key].map(track => new TrackData(track) ); 
    });    
    // return null as any;
  }

  getTrack(trackId:string):Promise<TrackData> {
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((track) => {
      return new TrackData(track); 
    });    
    // return null as any;
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    return this.sendRequestToExpress('/track-audio-features/' + encodeURIComponent(trackId)).then((track) => {
      let trackFeatures = [];
      // gets feature types to index json object
      TrackFeature.FeatureTypes.forEach((element) => {
        trackFeatures.push(new TrackFeature(element, track[element]));
      });

      return trackFeatures;
    });
    // return null as any;
  }
}
