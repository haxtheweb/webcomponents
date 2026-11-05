/**
 * Small JSON helpers around localStorage that never throw (private mode,
 * blocked storage and quota errors return the default / false instead).
 * Split out of utils.js so first-paint code can import them without the
 * rest of the utils barrel; utils.js re-exports them unchanged.
 */
export function localStorageGet(name, defaultValue = "") {
  try {
    if (localStorage.getItem(name) === null) {
      return defaultValue;
    }
    return JSON.parse(localStorage.getItem(name));
  } catch {
    return defaultValue;
  }
}

export function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, JSON.stringify(newItem));
  } catch {
    return false;
  }
}

// delete item from local storage
export function localStorageDelete(name) {
  try {
    return localStorage.removeItem(name);
  } catch {
    return false;
  }
}
