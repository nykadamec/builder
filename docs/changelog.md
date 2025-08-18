# Changelog

## 0.3.3 - 2025-01-18

### Added
- **Login Form with Error Handling**: Vytvořena nová login komponenta s kompletním error handlingem
- **Form Validation**: Implementována client-side validace pro login formulář pomocí Zod schématu
- **Error Display**: Přidáno zobrazování field-specific a general error zpráv
- **Loading States**: Implementovány loading stavy s animacemi během přihlašování
- **Remember Me**: Přidána funkce "Zapamatovat" pro trvalé přihlášení
- **Responsive Design**: Login formulář je plně responzivní s moderním designem

### Enhanced
- **Input Components**: Rozšířeny Input a PasswordInput komponenty o error handling
- **User Experience**: Vylepšeno UX s real-time error clearing při psaní
- **Security**: Implementována bezpečná komunikace s API endpointem
- **Accessibility**: Přidány ARIA labels a keyboard navigation support

## 0.3.2 - 2025-01-18

### Added
- **Password Confirmation Field**: Přidáno pole pro potvrzení hesla do moderního registračního formuláře (`registerform.tsx`)
- **Form State Management**: Přidán state management pro registrační formulář s validací
- **Error Handling**: Implementováno zobrazování chyb validace a serverových chyb
- **Loading States**: Přidány loading stavy pro lepší UX během registrace

### Fixed
- **Registration UI**: Opraveno chybějící pole pro potvrzení hesla v UI registračního formuláře
- **Form Submission**: Opraveno nesprávné odesílání formuláře jako GET request místo POST
- **Validation**: Přidána client-side validace před odesláním na server
- **Terms Agreement**: Přidána validace souhlasu s obchodními podmínkami

## 0.3.1 - 2025-01-17

### Fixed
- **Authentication System Conflict**: Vyřešen konflikt mezi NextAuth a vlastním JWT autentizačním systémem
- **JavaScript Console Errors**: Odstraněny chyby v konzoli způsobené konkurujícími si autentizačními systémy
- **API Route Compatibility**: Upraveny API routes pro použití pouze vlastního JWT middleware

### Removed
- **NextAuth Integration**: Odstraněn NextAuth systém pro zjednodušení autentizace
- **Session Provider**: Odstraněn AuthSessionProvider z layout komponenty
- **Duplicate Auth Routes**: Odstraněny konfliktní NextAuth API routes

### Changed
- **Authentication Flow**: Aplikace nyní používá pouze vlastní JWT autentizační systém
- **API Generate Route**: Přepracována pro použití vlastního auth middleware místo NextAuth

## 0.3.0 - 2024-08-17

### Added - Complete Authentication System

#### Database & Schema
- **SQLite3 Database**: Migrated from PostgreSQL to SQLite3 for simplified deployment
- **User Model Enhancement**: Added `username` and `password_hash` fields with proper indexing
- **Security Models**: Added `LoginAttempt` and `PasswordReset` models for security tracking
- **Database Migrations**: Created comprehensive migration for authentication system

#### Core Authentication Features
- **User Registration**: Email/username and password-based registration with validation
- **User Login**: Support for both email and username authentication
- **JWT Token System**: Secure access and refresh token generation with configurable expiry
- **Password Security**: bcrypt hashing with configurable rounds (default: 12)
- **Session Management**: HTTP-only cookies for secure token storage

#### Security Implementation
- **Rate Limiting**:
  - Login attempts: 5 per 15 minutes per email
  - Registration: 5 per 15 minutes per IP
  - Profile updates: 10 per 15 minutes per user
  - Password changes: 5 per 15 minutes per user
- **Input Validation**: Comprehensive Zod schemas for all authentication endpoints
- **Input Sanitization**: Protection against XSS and injection attacks
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Security Headers**: CSP, HSTS, X-Frame-Options, and other security headers
- **Password Requirements**: Configurable complexity requirements

#### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user profile
- `PUT /api/auth/profile` - Profile updates
- `POST /api/auth/change-password` - Password changes
- `DELETE /api/auth/delete-account` - Account deletion

#### Account Management
- **Profile Updates**: Change email, username, and display name
- **Password Changes**: Secure password change with current password verification
- **Account Deletion**: Secure account deletion with explicit confirmation
- **User Profile**: View account information and creation date

#### Frontend Components
- **LoginForm**: React component with validation and error handling
- **RegisterForm**: Registration form with password requirements display
- **ProfileForm**: Profile management component
- **ChangePasswordForm**: Password change component with strength validation

#### Authentication Middleware
- **JWT Verification**: Token validation middleware for protected routes
- **Rate Limiting Middleware**: Configurable rate limiting for API endpoints
- **CORS Middleware**: Cross-origin request handling
- **Security Headers**: Automatic security header injection

#### Testing Suite
- **Password Utilities Tests**: Comprehensive testing for password hashing and validation
- **JWT Token Tests**: Token generation, verification, and expiration testing
- **Validation Tests**: Input validation and sanitization testing

#### Route Protection System
- **Next.js Middleware**: Server-side route protection with automatic redirects
- **Protected Routes**: Builder, dashboard, profile pages require authentication
- **Public Route Handling**: Login/register pages redirect authenticated users
- **Return URL Support**: Automatic redirect to intended page after login
- **React Context**: Client-side authentication state management
- **Protection Components**: ProtectedRoute, AuthenticatedOnly, UnauthenticatedOnly
- **Custom Hooks**: useAuth, useRequireAuth, useLogin, usePermissions
- **Higher-Order Components**: withAuth for page-level protection

#### Documentation
- **Authentication Guide**: Complete documentation for authentication system (`docs/authentication.md`)
- **Route Protection Guide**: Detailed documentation for route protection features
- **API Reference**: Detailed API endpoint documentation
- **Security Guidelines**: Security best practices and configuration
- **Usage Examples**: Code examples for common authentication patterns
- **Test Page**: `/test-auth` page for testing authentication features

#### Dependencies Added
- `jsonwebtoken` - JWT token handling
- `express-rate-limit` - Rate limiting functionality
- `cors` - CORS configuration
- `helmet` - Security headers
- `express-validator` - Input validation

#### Configuration
- **Environment Variables**: Comprehensive .env configuration for security settings
- **Password Requirements**: Configurable password complexity rules
- **Rate Limiting**: Configurable rate limits for different endpoints
- **JWT Configuration**: Configurable token expiry and secrets

### Changed
- **Database Provider**: Migrated from PostgreSQL to SQLite3
- **User Model**: Enhanced with authentication fields
- **Application Version**: Updated to 0.3.0
- **Configuration**: Updated config.json with authentication features

### Security
- **Password Hashing**: Secure bcrypt implementation with configurable rounds
- **Token Security**: JWT tokens with proper expiration and secure storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Protection**: Configurable cross-origin request handling

## 0.2.0

- **Implementována nová landing page jako main page** (`src/app/page.tsx`)
  - Přepsána původní page.tsx s moderním dark designem inspirovaným Aceternity UI
  - Přidány Framer Motion animace pro smooth entrance effects
  - Implementován Aurora backdrop s radiálními gradienty
  - Gradient text efekty pro hlavní nadpisy
  - Glass morphism efekty pro tlačítka a navigaci
  - Responsive design s mobile-first přístupem

- **Vytvořen kompletní UI Design System** (`docs/UI_design_system.md`)
  - Definována barevná paleta s dark-first přístupem
  - Typografická hierarchie a komponenty
  - Animační systém s Framer Motion
  - Gradient efekty a glow borders
  - Accessibility guidelines
  - Implementation notes a best practices
  - Inspirováno Aceternity UI knihovnou

## 0.1.0

- Added Playwright to devDependencies and verified installation
- Created Playwright config: `playwright.config.ts`
- Added example E2E test: `tests/example.spec.ts`
- Added E2E scripts to package.json: test:e2e, test:e2e:ui, test:e2e:report
- Created docs: `docs/Playwright.md`
- Created `config.json` with app meta and Playwright settings

