import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock the child components with unique testIds to avoid conflicts
jest.mock('../About', () => {
  return function MockAbout() {
    return <div data-testid="about-mock">About Component</div>;
  };
});

jest.mock('../Projects', () => {
  return function MockProjects() {
    return <div data-testid="projects-mock">Projects Component</div>;
  };
});

jest.mock('../Contact', () => {
  return function MockContact() {
    return <div data-testid="contact-mock">Contact Component</div>;
  };
});

describe('Navigation Component', () => {
  const mockProjects = [
    {
      _id: '1',
      projName: 'Test Project',
      description: 'Test Description',
      imgSrc: '/test.jpg',
      tech: [{ techName: 'React' }]
    }
  ];

  const mockSetSiteState = jest.fn();

  beforeEach(() => {
    mockSetSiteState.mockClear();
  });

  test('renders navigation buttons', () => {
    render(
      <Navigation 
        siteState={0} 
        setSiteState={mockSetSiteState} 
        isLarge={false} 
        projects={mockProjects} 
      />
    );
    
    // Check if buttons are rendered
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
    expect(screen.getByText('MY WORK')).toBeInTheDocument();
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });

  test('clicking About button changes site state', () => {
    render(
      <Navigation 
        siteState={0} 
        setSiteState={mockSetSiteState} 
        isLarge={false} 
        projects={mockProjects} 
      />
    );
    
    // Click the About button
    fireEvent.click(screen.getByText('ABOUT'));
    
    // Check if setSiteState was called with the correct argument
    expect(mockSetSiteState).toHaveBeenCalledWith(1);
  });

  test('clicking About button when already selected resets site state', () => {
    render(
      <Navigation 
        siteState={1} 
        setSiteState={mockSetSiteState} 
        isLarge={false} 
        projects={mockProjects} 
      />
    );
    
    // Click the About button when it's already selected
    fireEvent.click(screen.getByText('ABOUT'));
    
    // Check if setSiteState was called with 0 to reset
    expect(mockSetSiteState).toHaveBeenCalledWith(0);
  });
});