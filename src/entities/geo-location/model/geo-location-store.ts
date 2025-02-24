import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { GeoLocationStates, GeoLocationStoreInterface } from './geo-location-interfaces.ts';

const geoLocationInitialStates: GeoLocationStates = {
  location: {
    latitude: 35.938976,
    longitude: 126.9481122,
  },
};

const useGeoLocationStore = create<GeoLocationStoreInterface>()((set) => {
  return {
    ...geoLocationInitialStates,
    actions: {
      setGeoLocation: (location) => {
        set({ location });
      },
    },
  };
});

export const useLocation = () => useGeoLocationStore(useShallow((state) => state.location));
export const geoLocationActions = useGeoLocationStore.getState().actions;
