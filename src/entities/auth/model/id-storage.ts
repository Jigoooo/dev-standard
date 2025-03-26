const ID_KEY = 'id';

export function setId(id: string) {
  localStorage.setItem(ID_KEY, id);
}

export function getId() {
  return localStorage.getItem(ID_KEY) ?? '';
}

export function removeId() {
  localStorage.removeItem(ID_KEY);
}
