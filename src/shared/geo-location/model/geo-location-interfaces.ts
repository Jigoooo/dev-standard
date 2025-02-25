export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface GeoLocationStates {
  location: ILocation;
}

export interface GeoLocationActions {
  setGeoLocation: (location: ILocation) => void;
}

export interface GeoLocationStoreInterface extends GeoLocationStates {
  actions: GeoLocationActions;
}
