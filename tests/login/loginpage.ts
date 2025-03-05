import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async gotoLoginPage(): Promise<void> {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoodCredentials(): Promise<void> {
    await this.login("standard_user", "secret_sauce");
  }

  async loginWithBadCredentials(): Promise<void> {
    await this.login("fake_account", "wrong_password");
  }

  async loginWithUpperCase(): Promise<void> {
    await this.login("Standard_user", "Secret_sauce");
  }
  async loginWithLockedOutUser(): Promise<void> {
    await this.login("locked_out_user", "secret_sauce");
  }
  async loginWithProblemUser(): Promise<void> {
    await this.login("problem_user", "secret_sauce");
  }
  async loginWithPerformanceGlitchUser(): Promise<void> {
    await this.login("performance_glitch_user", "secret_sauce");
  }
}
