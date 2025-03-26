const LAST_LOCATION_KEY = 'lastLocation';

export function setLastLocation(id: string) {
  localStorage.setItem(LAST_LOCATION_KEY, id);
}

export function getLastLocation() {
  return localStorage.getItem(LAST_LOCATION_KEY);
}

export function removeLastLocation() {
  localStorage.removeItem(LAST_LOCATION_KEY);
}
