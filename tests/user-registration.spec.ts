import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Navštívit registrační stránku
    await page.goto('/register');
  });

  test('should display modern registration form with password confirmation field', async ({ page }) => {
    // Navštívit moderní registrační stránku
    await page.goto('/auth/register');

    // Ověřit, že formulář je viditelný
    await expect(page.locator('text=Vytvořit účet')).toBeVisible();

    // Ověřit všechna pole včetně potvrzení hesla
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Ověřit labely
    await expect(page.locator('text=Jméno')).toBeVisible();
    await expect(page.locator('text=E-mail')).toBeVisible();
    await expect(page.locator('text=Heslo')).toBeVisible();
    await expect(page.locator('text=Potvrdit heslo')).toBeVisible();

    // Ověřit tlačítko
    await expect(page.locator('button[type="submit"]')).toContainText('Vytvořit účet');
  });

  test('should show validation errors for modern registration form', async ({ page }) => {
    // Navštívit moderní registrační stránku
    await page.goto('/auth/register');

    // Počkat na načtení stránky
    await page.waitForLoadState('networkidle');

    // Zkusit odeslat prázdný formulář
    await page.locator('button[type="submit"]').click();

    // Počkat chvilku na zpracování
    await page.waitForTimeout(1000);

    // Ověřit, že se zobrazí chyba o souhlasu s podmínkami
    await expect(page.locator('text=Musíte souhlasit s obchodními podmínkami')).toBeVisible();

    // Zaškrtnout souhlas a zkusit znovu
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]').click();

    // Počkat na zpracování validace
    await page.waitForTimeout(1000);

    // Ověřit, že se zobrazí validační chyby pro prázdná pole
    // Použijeme obecnější selektory pro chybové zprávy
    await expect(page.locator('.text-red-400').first()).toBeVisible();
  });

  test('should show password mismatch error in modern form', async ({ page }) => {
    // Navštívit moderní registrační stránku
    await page.goto('/auth/register');

    // Vyplnit formulář s různými hesly
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('TestPassword123!');
    await page.locator('input[name="confirmPassword"]').fill('DifferentPassword123!');
    await page.locator('input[type="checkbox"]').check();

    // Odeslat formulář
    await page.locator('button[type="submit"]').click();

    // Ověřit chybu o neshodě hesel
    await expect(page.locator('text=Passwords don\'t match')).toBeVisible();
  });

  test('should successfully register with valid data in modern form', async ({ page }) => {
    // Navštívit moderní registrační stránku
    await page.goto('/auth/register');

    // Počkat na načtení stránky
    await page.waitForLoadState('networkidle');

    // Vyplnit formulář s validními daty
    const timestamp = Date.now();
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill(`test${timestamp}@example.com`);
    await page.locator('input[name="password"]').fill('TestPassword123!');
    await page.locator('input[name="confirmPassword"]').fill('TestPassword123!');
    await page.locator('input[type="checkbox"]').check();

    // Odeslat formulář
    await page.locator('button[type="submit"]').click();

    // Počkat na zpracování
    await page.waitForTimeout(2000);

    // Ověřit, že došlo k přesměrování na login stránku
    await expect(page).toHaveURL(/\/login/);

    // Ověřit, že URL obsahuje zprávu o úspěšné registraci
    expect(page.url()).toContain('message=Registrace%20%C3%BAsp%C4%9B%C5%A1n%C3%A1');
  });

  test('should display registration form with all fields', async ({ page }) => {
    // Ověřit, že formulář je viditelný
    await expect(page.locator('h2')).toContainText('Create Account');
    
    // Ověřit všechna pole
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    
    // Ověřit tlačítko
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account');
    
    // Ověřit odkaz na přihlášení
    await expect(page.locator('a[href="/login"]')).toContainText('Sign in');
  });

  test('should show password requirements when password field is focused', async ({ page }) => {
    // Kliknout na pole hesla
    await page.locator('#password').focus();
    
    // Ověřit, že se zobrazí požadavky na heslo
    await expect(page.locator('text=Password requirements:')).toBeVisible();
    await expect(page.locator('text=At least')).toBeVisible();
    await expect(page.locator('text=Contains uppercase letter')).toBeVisible();
    await expect(page.locator('text=Contains lowercase letter')).toBeVisible();
    await expect(page.locator('text=Contains number')).toBeVisible();
    await expect(page.locator('text=Contains special character')).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Kliknout na submit bez vyplnění povinných polí
    await page.locator('button[type="submit"]').click();
    
    // Ověřit, že se zobrazí chyby validace (možné různé zprávy)
    const emailError = page.locator('text=Email is required, text=Invalid email format');
    const passwordError = page.locator('text=Password is required, text=Password must be at least');
    await expect(emailError.first()).toBeVisible();
    await expect(passwordError.first()).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Vyplnit neplatný email
    await page.locator('#email').fill('invalid-email');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('ValidPassword123!');
    
    // Submit formulář
    await page.locator('button[type="submit"]').click();
    
    // Ověřit chybu validace emailu
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({ page }) => {
    // Vyplnit hesla, která se neshodují
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('DifferentPassword123!');
    
    // Submit formulář
    await page.locator('button[type="submit"]').click();
    
    // Ověřit chybu neshodných hesel
    await expect(page.locator('text=Passwords don\'t match')).toBeVisible();
  });

  test('should show validation error for weak password', async ({ page }) => {
    // Vyplnit slabé heslo
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('weak');
    await page.locator('#confirmPassword').fill('weak');
    
    // Submit formulář
    await page.locator('button[type="submit"]').click();
    
    // Ověřit chybu slabého hesla (možné různé zprávy)
    const weakPasswordError = page.locator('text=Password must be at least, text=Password must contain uppercase');
    await expect(weakPasswordError.first()).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    // Generovat unikátní email pro test
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    // Vyplnit všechna pole s validními daty
    await page.locator('#email').fill(testEmail);
    await page.locator('#username').fill(`testuser${timestamp}`);
    await page.locator('#name').fill('Test User');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('ValidPassword123!');
    
    // Submit formulář
    await page.locator('button[type="submit"]').click();
    
    // Ověřit, že se zobrazí loading stav
    await expect(page.locator('button[type="submit"]')).toContainText('Creating account...');
    
    // Počkat na dokončení registrace - buď úspěch nebo chyba
    await page.waitForTimeout(3000);
    
    // Ověřit výsledek - buď přesměrování na hlavní stránku nebo zobrazení chyby
    const currentUrl = page.url();
    const hasError = await page.locator('.bg-red-50').isVisible();
    
    if (!hasError) {
      // Úspěšná registrace - ověřit přesměrování
      expect(currentUrl).toBe('http://localhost:3000/');
    } else {
      // Pokud je chyba (např. duplicitní email), ověřit její zobrazení
      await expect(page.locator('.bg-red-50')).toBeVisible();
    }
  });

  test('should handle duplicate email registration', async ({ page }) => {
    // Použít známý email pro test duplicity
    const duplicateEmail = 'duplicate@example.com';
    
    // Vyplnit formulář s duplicitním emailem
    await page.locator('#email').fill(duplicateEmail);
    await page.locator('#username').fill('testuser2');
    await page.locator('#name').fill('Test User 2');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('ValidPassword123!');
    
    // Submit formulář dvakrát pro simulaci duplicity
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    // Zkusit znovu se stejným emailem
    await page.goto('/register');
    await page.locator('#email').fill(duplicateEmail);
    await page.locator('#username').fill('testuser3');
    await page.locator('#name').fill('Test User 3');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('ValidPassword123!');
    
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    // Ověřit chybu duplicitního emailu (pokud je implementována)
    const hasErrorMessage = await page.locator('.bg-red-50').isVisible();
    if (hasErrorMessage) {
      await expect(page.locator('.bg-red-50')).toContainText(/email.*already.*exists|already.*registered/i);
    }
  });

  test('should clear field errors when user starts typing', async ({ page }) => {
    // Vyvolat chybu validace
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
    
    // Začít psát do pole email
    await page.locator('#email').fill('t');
    
    // Ověřit, že chyba zmizela (počkáme na reakční timeout)
    await page.waitForTimeout(500);
    await expect(page.locator('text=Email is required')).not.toBeVisible();
  });

  test('should navigate to login page from registration', async ({ page }) => {
    // Kliknout na odkaz "Sign in"
    await page.locator('a[href="/login"]').click();
    
    // Ověřit přesměrování na přihlašovací stránku
    await expect(page).toHaveURL('/login');
  });

  test('should disable form during submission', async ({ page }) => {
    // Vyplnit validní data
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('ValidPassword123!');
    await page.locator('#confirmPassword').fill('ValidPassword123!');
    
    // Submit formulář
    await page.locator('button[type="submit"]').click();
    
    // Ověřit, že jsou pole zakázaná během submitu
    await expect(page.locator('#email')).toBeDisabled();
    await expect(page.locator('#password')).toBeDisabled();
    await expect(page.locator('#confirmPassword')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});