import { useState, useEffect } from 'react';

import { geoLocationActions } from '@/entities/geo-location';

export function useGeoLocation(options = {}) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>();
  const [error, setError] = useState('');

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    geoLocationActions.setGeoLocation({ latitude, longitude });

    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  return { location, error };
}
