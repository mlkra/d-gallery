import { AppPage } from './app.po';
import { browser, until, ExpectedConditions } from 'protractor';
import * as path from 'path';

describe('d-gallery e2e tests', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display login form', () => {
    page.navigateTo();
    expect(page.getLoginForm().isDisplayed).toBeTruthy();
  });
  
  it('should redirect unregistered user', () => {
    page.navigateToHome();
    expect(browser.getCurrentUrl()).not.toEqual('http://localhost:4200/home');
  });
});

describe('d-gallery e2e tests without synchronization', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.ignoreSynchronization = true;
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  afterEach(() => {
    browser.ignoreSynchronization = false;
  });

  it('should login user test', () => {
    page.navigateTo();
    page.login();
    browser.wait(ExpectedConditions.presenceOf(page.getCanvas())).then(() => {
      expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/home');
    });
  });

  it('should redirect logged in user', () => {
    page.navigateTo();
    page.login();
    page.navigateToLogin();
    expect(browser.getCurrentUrl()).not.toEqual('http://localhost:4200/user/login');
  });

  it('should display upload form', () => {
    page.navigateTo();
    page.login();
    page.navigateToUpload();
    expect(page.getUploadFileInput().isDisplayed).toBeTruthy();
  });

  it('should upload file', () => {
    page.navigateTo();
    page.login();
    page.navigateToUpload();

    const filePath = 'e2e/img0001.jpg';
    const aPath = path.resolve(filePath);
    const input = page.getUploadFileInput();
    browser.wait(ExpectedConditions.presenceOf(input)).then(() => {
      input.sendKeys(aPath);
      page.getUploadFileButton().click();
      const result = page.getUploadResult();
      browser.wait(ExpectedConditions.visibilityOf(result)).then(() => {
        expect(result.getText()).toEqual('Success!');
      });
    });
  });
});
