
### Common Directory Structure
Each UI app typically contains:
- `src/`
  - `components/` - React components
  - `pages/` - Page-level components
  - `layouts/` - Layout wrappers
  - `ducks/`  - Redux state management & operations
  - `services/` - API services and state management
  - `App.jsx` - Main app component w/ routing
  - `index.js` - Entry point
- `build-utils/` - build system configuration files
  - `.env.local`, `.env.docker`, `.env.production`, `.env.staging` - Environment variables

### Component Structure
This project uses a fixed component structure. Each component should have its own folder structured like so:
- components
    - component-name
        - index.js // contains imports and exports for the component
        - component-name.jsx // main component file
        - component-name.styles.scss // component styles
        - component-name.config.js // component configuration; used for column generation for MUI data grid, autoform config, dependent utils, etc

If a component reaches > 500 lines of code, it should be broken up into smaller components. You can place a components folder inside the component folder to store these smaller components. If the smaller components are reused more than once in the UI repo you're working in, you should move them to the components folder at the root of the project. If the smaller components are used across multiple UI repos, you should move them to the components folder at the root of the library-ui project.

### State & Services
#### Redux Usage Guidelines
This project uses Redux & Redux Toolkit. When writing a state slice for redux, you should always write code that uses the following structure:
* ducks
    - duck-name.slice.js // redux state slice
    - duck-name.selectors.js // redux state selectors
    - duck-name.operations.js // redux state operations - these should always be testable JS functions

Whenever possible, use the createAsyncThunk function from Redux Toolkit to create async thunks for your state operations.

#### Service Usage Guidelines
This project should use Axios for making HTTP requests

## Code Quality
### Linting
Each app has ESLint configured. Run ESLint manually if needed:
```bash
npx eslint src/
```
### Avoid These Patterns
- Generic `any` types in TypeScript
- Excessive use of ternary operators for complex logic