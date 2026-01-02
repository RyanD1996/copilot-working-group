# Custom Agents Setup

This file configures custom GitHub Copilot agents for this repository to enhance AI-assisted development with specialized knowledge.

## Available Agents

### React Developer Agent

**Description**: An expert in React 19, TypeScript, and modern React patterns including hooks, context, and functional components.

**Specialties**:
- React component development with TypeScript
- React hooks and custom hooks
- React Context API for state management
- TanStack Query (React Query) for data fetching
- TanStack Router for routing
- Testing with Vitest and React Testing Library

**Use when**:
- Creating new React components
- Writing custom hooks
- Implementing data fetching with React Query
- Setting up routing with TanStack Router
- Writing component tests

### Testing Agent

**Description**: An expert in writing tests with Vitest and React Testing Library following best practices.

**Specialties**:
- Vitest test configuration and setup
- React Testing Library best practices
- User interaction testing with @testing-library/user-event
- Mocking external dependencies and API calls
- Testing React components with hooks and context

**Use when**:
- Writing new tests for components
- Debugging failing tests
- Improving test coverage
- Setting up test mocks

### Build & Configuration Agent

**Description**: An expert in Vite, ESLint, and TypeScript configuration for modern React applications.

**Specialties**:
- Vite configuration and optimization
- ESLint 9 flat config format
- TypeScript configuration and type checking
- React Compiler (babel-plugin-react-compiler)
- Build optimization and performance

**Use when**:
- Configuring build tools
- Fixing linting issues
- Optimizing build performance
- Setting up new development tools

## Agent Guidelines

When working with these agents, they should:

1. **Follow Repository Conventions**: Adhere to the code style, structure, and patterns defined in `.github/copilot-instructions.md`

2. **Maintain Consistency**: Keep component structure, naming conventions, and testing patterns consistent with existing code

3. **Prioritize TypeScript**: Always use proper TypeScript types and avoid `any` type

4. **Test Coverage**: Ensure new code includes appropriate test coverage

5. **Performance**: Consider performance implications, especially for React components and build configuration

## Example Agent Prompts

### For Component Creation
```
@react-dev Create a new ProductFilter component that allows filtering products by category and price range. 
Include TypeScript types, use TanStack Query for fetching filter options, and add appropriate tests.
```

### For Testing
```
@testing Write comprehensive tests for the ProductGrid component including loading states, 
empty states, and user interactions using React Testing Library.
```

### For Configuration
```
@build-config Add a new ESLint rule to enforce consistent component export patterns and 
update the TypeScript configuration to enable strict null checks.
```

## Integration with Development Workflow

Agents should be aware of:
- Available npm scripts: `dev`, `build`, `test`, `lint`, `lint:fix`, `preview`
- Test environment: jsdom with globals enabled
- Build tool: Vite with React Compiler
- Code quality: ESLint 9 with TypeScript ESLint
- Type checking: TypeScript 5.9.3

## References

- Main instructions: `.github/copilot-instructions.md`
- Project structure: `src/` directory
- Configuration files: `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `tsconfig.json`
