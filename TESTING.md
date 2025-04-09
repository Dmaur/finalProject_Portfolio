# Unit Testing Guide

This guide explains how to write and run unit tests for the NextJS portfolio project.

## Testing Setup

The project uses the following testing tools:

- **Jest**: The testing framework
- **React Testing Library**: For testing React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (tests will automatically rerun when files change):

```bash
npm run test:watch
```

## Test Structure

Tests are organized in `__tests__` directories next to the code they're testing:

```
src/
  components/
    __tests__/         # Component tests
      Footer.test.tsx
      Navigation.test.tsx
  tools/
    __tests__/         # Data model tests
      data.model.test.ts
```

## Writing Component Tests

### Basic Component Test Structure

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  test('renders correctly', () => {
    render(<YourComponent />);
    
    // Your assertions here
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Mocking Dependencies

For components that depend on other components or external modules, use Jest's mocking capabilities:

```tsx
// Mock a component
jest.mock('../DependencyComponent', () => {
  return function MockComponent() {
    return <div data-testid="mocked-component">Mocked Component</div>;
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

### Testing User Interactions

Use fireEvent to simulate user interactions:

```tsx
test('button click works', () => {
  const mockFn = jest.fn();
  render(<Button onClick={mockFn} />);
  
  fireEvent.click(screen.getByRole('button'));
  
  expect(mockFn).toHaveBeenCalled();
});
```

## Common Testing Patterns

### Testing Conditional Rendering

```tsx
test('conditionally renders content based on prop', () => {
  const { rerender } = render(<Component showContent={false} />);
  
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
  
  rerender(<Component showContent={true} />);
  
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

### Testing Component Props

```tsx
test('renders with correct props', () => {
  render(<Component title="Test Title" />);
  
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### Testing Links and Navigation

```tsx
test('renders correct links', () => {
  render(<Footer />);
  
  const links = screen.getAllByRole('link');
  expect(links[0]).toHaveAttribute('href', 'https://example.com');
});
```

## Best Practices

1. Test component behavior, not implementation details
2. Use screen queries that mirror how users interact with your app
3. Prefer `getByRole` and `getByText` over `getByTestId` when possible
4. Keep tests simple and focused on one behavior per test
5. Use descriptive test names that explain what's being tested
6. Mock external dependencies and services

## Adding New Tests

1. Create a new test file in the appropriate `__tests__` directory
2. Import the component or module to test
3. Write your test cases using Jest's `describe` and `test` functions
4. Run tests to verify they pass

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Jest DOM Custom Matchers](https://github.com/testing-library/jest-dom)