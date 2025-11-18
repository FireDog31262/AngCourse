# Angular 20 Best Practices Audit

**Scope:** Entire `src/app` tree (components, services, routing, and configuration).

## Executive Summary

- The project already embraces standalone APIs and signals, but many files still carry Angular 15-era patterns (explicit `standalone: true`, template-driven forms, class-based guards) that conflict with the Angular 20 guidance in the official best-practices brief.
- Feature modules load eagerly and every route points directly at a component. Angular 20 recommends lazy feature routes and, when possible, zoneless change detection paired with updated test tooling.
- Several components keep imperative subscriptions and imperative layout libraries (`@ngbracket/ngx-layout`) instead of using CSS utilities, typed reactive forms, or the new control-flow primitives consistently.

## Priority Findings

| ID  | Area                            | Issue                                                                                                                                                                                                                    | Impact                                                          | Files/Examples                                                                                                                                                                                                        |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Component Declarations          | `standalone: true` is set explicitly across most components even though Angular 20 treats standalone as the default and the best-practices guide forbids specifying it.                                                  | Duplicate metadata and migration friction.                      | `app/app.ts`, `Components/auth/login/login.ts`, `Components/auth/sign-up/sign-up.ts`, all training components, `navigation/header/header.ts`, `navigation/side-nav-list/side-nav-list.ts`, `welcome/welcome.ts`, etc. |
| A2  | Routing & Structure             | All feature routes eagerly load their components and use class-based `CanActivate` guards. Angular 20 prefers lazy-loaded feature routes and function-based guards created via `inject`.                                 | Larger initial bundle, slower startup, harder testing.          | `app.routes.ts`, `Components/auth/auth.guard.ts`.                                                                                                                                                                     |
| A3  | Forms                           | Auth flows rely on template-driven forms (`FormsModule`, `NgForm`). Best practices call for typed reactive forms and signals.                                                                                            | Harder validation, less type safety, no signal integration.     | `auth/login/login.ts`, `auth/login/login.html`, `auth/sign-up/sign-up.ts`, `auth/sign-up/sign-up.html`.                                                                                                               |
| A4  | Layout                          | Templates still use `@ngbracket/ngx-layout` directives (`fxLayout`, `fxHide`, `fxFlex`) and inline styles for spacing, even though Angular 20 guidance favors CSS (Flex/ Grid) + `host` bindings.                        | Additional runtime dependency and less predictable layouts.     | `app/app.html`, `navigation/header/header.html`, `Components/welcome/welcome.html`, `training/new-training/new-training.html`, etc.                                                                                   |
| A5  | Signals vs Store Duplication    | `AuthService` mirrors user/auth state in both a local signal and NgRx store. Best practices recommend a single source of truth (NgRx) with derived signals (`store.selectSignal`).                                       | Risk of state divergence and duplicated logic.                  | `Components/auth/auth.service.ts`.                                                                                                                                                                                    |
| A6  | Dialog/Subscription Cleanup     | `current-training.ts` opens a dialog and subscribes to `afterClosed()` without `takeUntilDestroyed()`/`firstValueFrom`, leaving manual unsubscribe responsibilities.                                                     | Potential memory leaks and inconsistent teardown.               | `Components/training/current-training/current-training.ts`.                                                                                                                                                           |
| A7  | Data Layer Responsibilities     | `training.service.ts` intermixes Firestore I/O, store dispatches, logging, and UI-snackbar orchestration. Angular 20 guidance recommends lean services (signals for state) plus NgRx effects for side-effects/snackbars. | Harder to test, violates single-responsibility.                 | `Components/training/training.service.ts`.                                                                                                                                                                            |
| A8  | Testing & Zone Configuration    | App config opts into `provideZonelessChangeDetection`, but Karma specs still assume Zone.js, causing NG0908 test failures.                                                                                               | Test suite cannot pass; CI blocked.                             | `app/app.config.ts`, Karma output (`ng test`).                                                                                                                                                                        |
| A9  | Deprecated Layout/Host Patterns | Components rely on inline `[style]` and `fxHide` rather than `host: { class: ... }` or CSS utility classes.                                                                                                              | Less maintainable styling, violates “host object” rule.         | `navigation/header/header.html`, `app/app.html`, others.                                                                                                                                                              |
| A10 | Dead/Commented Code             | `shared/ui.service.ts` is fully commented out while related actions/effects remain.                                                                                                                                      | Creates confusion and drift between service vs NgRx approaches. | `shared/ui.service.ts`.                                                                                                                                                                                               |

## Detailed Notes & Recommendations

### A1. Remove explicit `standalone: true`

- **Status:** ✅ Completed (Nov 16, 2025). All components now rely on the default standalone behavior.
- **Details:** Files such as `src/app/app.ts`, `src/app/Components/auth/login/login.ts`, and every training component set `standalone: true` in the decorator.
- **Guideline tie-in:** The Angular 20 best-practices sheet explicitly states “Must NOT set `standalone: true` … It’s the default.”
- **Action:** Delete the `standalone` property in each decorator; no behavioral change, but keeps metadata clean.

### A2. Introduce lazy routes & functional guards

- **Status:** ✅ Completed. Routes now use `loadComponent` for auth, training, and welcome features, and the guard is functional with `store.selectSignal`.
- **Details:** `app.routes.ts` registers raw component classes and uses a class-based `AuthGuard` with `CanActivate` + RxJS `take/map`.
- **Action:** Break features (auth, training, welcome/product) into route-level lazy loaders (`loadComponent`, `loadChildren`) and convert guard to a standalone function: `export const authGuard: CanActivateFn = (route) => inject(Store).selectSignal(...) ? true : inject(Router).createUrlTree([...])`. This also lets you reuse NgRx signal selectors instead of manual `take(1)`.

### A3. Migrate Auth UI to typed reactive forms

- **Status:** ✅ Login and Sign-Up now use typed reactive forms with `store.selectSignal`-backed loading indicators.
- **Details:** `auth/login/login.ts` and `sign-up/sign-up.ts` both import `FormsModule`, bind to `NgForm`, and pass `form.value` to the service.
- **Action:** Replace with `FormGroup`/`FormControl` (typed) plus `ReactiveFormsModule`. Use signals/computed values for validation hints and drop the template-driven directives.

### A4. Replace `fxLayout` with CSS/host bindings

- **Status:** ✅ Completed. All templates now use CSS/host classes, and `@ngbracket/ngx-layout` has been removed from the dependencies.
- **Details:** Almost every template (`welcome.html`, `new-training.html`, `header.html`, `app.html`) uses `fxLayout`, `fxFlex`, `fxHide`.
- **Action:** Migrate to CSS Flex/Grid classes defined in the `.less` files and bind via `host` objects. If responsive behavior is required, leverage modern CSS media queries rather than runtime directives.

### A5. Collapse duplicated auth state

- **Status:** ✅ Completed (Nov 16, 2025). `AuthService` now derives its auth signals straight from NgRx selectors, eliminating the duplicate local user signal.
- **Details:** `AuthService` previously maintained a local `signal<User | null>` while NgRx already stored the `User` via `SetAuthenticated`; components like `SideNavList` consumed the service signal instead of the store selector.
- **Action:** Remove the local signal, expose `store.selectSignal(getUser)` / `getIsAuthenticated`, and keep `AuthService` focused on coordinating Firebase auth plus navigation rather than mirroring store state.

### A6. Ensure dialog streams tear down automatically

- **Status:** ✅ Completed (Nov 16, 2025). `CurrentTraining` now injects `DestroyRef` and pipes the dialog close stream through `takeUntilDestroyed`, so no manual unsubscribe is needed.
- **Details:** The dialog previously used a bare `subscribe`, which risked leaks if the component destroyed mid-dialog.
- **Action:** Wrap `dialogRef.afterClosed()` with `takeUntilDestroyed(inject(DestroyRef))` (or equivalently `firstValueFrom`) to align with the Angular 20 guidance on automatic teardown.

### A7. Split Firestore effects from TrainingService

- **Status:** ✅ Completed (Nov 16, 2025). Firestore I/O plus snackbar side effects now live in `TrainingEffects`, while `TrainingService` only manages signals and dispatches NgRx actions.
- **Details:** `training.service.ts` previously dispatched UI loading/snackbar actions and fetched Firestore directly, mixing UI concerns with persistence and producing console noise.
- **Action:** Move Firestore calls into NgRx effects (or dedicated repository services) and keep `TrainingService` as a thin state holder with signals/computed, per “single responsibility” guidance.

### A8. Align zoneless config with testing

- **Status:** ✅ Completed (Nov 18, 2025). Tests now stub Location so router navigations stay inside the Karma iframe.
- **Details:** Production bootstrapping uses `provideZonelessChangeDetection`, but Karma still expects Zone.js and fails with NG0908. Tests also hit `No provider for Auth` because test harness didn’t include the Firebase providers from `app.config.ts`.
- **Action:** Either (a) re-enable zones for now (`provideZoneChangeDetection` + include `zone.js/testing`), or (b) update Karma/TestBed to the zoneless recipe (install `@angular/dev-infra`, add `provideNoopAnimations`, etc.). Also supply Firebase providers/mocks via `beforeEach(() => TestBed.configureTestingModule({ providers: [...] }))`.

### A9. Host bindings & style hygiene

- **Status:** ✅ Completed. Inline layout styling has been replaced with semantic classes (e.g., header toolbar, auth forms), aligning with the `host`-object guidance.
- **Details:** Components such as `Header` and `App` set inline styles (`style="flex: 1 1 auto;"`) and rely on `fxHide`. Angular 20 asks us to manage host CSS via the `host` property to avoid `@HostBinding/@HostListener`.
- **Action:** Move layout responsibilities into `.less` files and attach classes via `host: { class: 'app-header' }`. Replace `fxHide` with CSS breakpoints.

### A10. Remove dead UI service

- **Details:** `src/app/shared/ui.service.ts` is fully commented but still present. Effects already handle snackbars.
- **Action:** Delete the file or re-implement it properly; otherwise the commented code confuses IDE searches and inflates maintenance overhead.

### Additional Observations

- **NgOptimizedImage:** ✅ Completed (Nov 16, 2025). `Components/welcome` now imports `NgOptimizedImage` and renders the hero art via `ngSrc` so future marketing panels comply automatically.
- **Signals in templates:** Some components still rely on `AsyncPipe` (`new-training`, `login`, `sign-up`). Consider switching to `store.selectSignal`/`toSignal` for purely synchronous reads so templates stay signal-first.
- **`MatTableDataSource`:** ✅ Completed (Nov 16, 2025). `PastTraining` was rewritten to drive a semantic table from signals/computed values with filter + paginator state instead of mutating `MatTableDataSource`.
- **SideNav logout flow:** `SideNavList` injects `AuthService` even though the NgRx store already exposes `getIsAuthenticated`. Aligning with store signals allows easier testing and removes direct service coupling.

## Next Steps

1. Agree on a folder-by-folder refactor plan (e.g., auth → training → navigation) so changes can be reviewed incrementally.
2. Start with the highest-impact findings (A1–A3 and A8) because they unblock tests and enforce the global style.
3. Create tracking issues per finding and link to this audit file for context.
