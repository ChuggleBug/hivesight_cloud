
// A wrapper function for local storage
// 
class LocalStorageManager {
  constructor() {
    throw new Error("This class cannot be instantiated");
  }

  static getCurrentUsername() {
    return localStorage.getItem('user');
  }

  static setCurrentUsername(username) {
    return localStorage.setItem('user', username);
  }

  static isLoggedIn() {
    return Boolean(this.getAuthToken());
  }

  static setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  static getAuthToken() {
    return localStorage.getItem('token');
  }
}

// Treat the class as staic
Object.freeze(LocalStorageManager);

export default LocalStorageManager;