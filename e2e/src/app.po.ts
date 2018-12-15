import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  navigateToHome() {
    return browser.get('/home');
  }

  navigateToLogin() {
    return browser.get('/user/login');
  }

  navigateToUpload() {
    return browser.get('/upload');
  }

  login() {
    this.navigateTo();
    this.getEmailInput().sendKeys('test@test.test');
    this.getPasswordInput().sendKeys('testtest');
    return this.getSignInButton().click();
  }
  
  getCanvas() {
    return element(by.tagName('app-canvas'));
  }

  getLoginForm() {
    return element(by.id('app-login-form'));
  }

  getUploadFileInput() {
    return element(by.id('app-file-input'));
  }

  getUploadFileButton() {
    return element(by.id('app-upload-button'));
  }

  getUploadResult() {
    return element(by.id('app-result'));
  }

  private getEmailInput() {
    return element(by.id('app-input-email'));
  }

  private getPasswordInput() {
    return element(by.id('app-input-password'));
  }

  private getSignInButton() {
    return element(by.id('app-signin-button'));
  }
}
