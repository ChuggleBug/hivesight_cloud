
// A wrapper function for local storage
// 
class LocalStorageManager {
  constructor() {
    throw new Error("This class cannot be instantiated");
  }

  static getCurrentUsername() {
    return localStorage.getItem('user');
  }

  static isLoggedIn() {
    return false;
  }
}

// Treat the class as staic
Object.freeze(LocalStorageManager);

export default LocalStorageManager;