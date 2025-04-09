import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import '@testing-library/jest-dom';

// Mock the Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, height, width }: { 
    src: string; 
    alt: string; 
    className: string; 
    height: number; 
    width: number 
  }) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      height={height} 
      width={width} 
      data-testid={`image-${alt}`} 
    />
  ),
}));

describe('Footer Component', () => {
  test('renders social media links', () => {
    render(<Footer />);
    
    // Check that all three social links are rendered
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
    
    // Check the LinkedIn link
    expect(links[0]).toHaveAttribute('href', 'https://www.linkedin.com/in/derrick-maurais-a37b3224a');
    expect(links[0]).toHaveAttribute('target', '_blank');
    
    // Check the Bluesky link
    expect(links[1]).toHaveAttribute('href', 'https://bsky.app/profile/dmauronionnet.bsky.social');
    expect(links[1]).toHaveAttribute('target', '_blank');
    
    // Check the GitHub link
    expect(links[2]).toHaveAttribute('href', 'https://github.com/Dmaur');
    expect(links[2]).toHaveAttribute('target', '_blank');
  });
  
  test('renders social media icons', () => {
    render(<Footer />);
    
    // Check that all social media icons are rendered
    const linkedinIcon = screen.getByTestId('image-linkedin icon');
    const blueskyIcon = screen.getByTestId('image-Twitter icon');
    const githubIcon = screen.getByTestId('image-github icon');
    
    expect(linkedinIcon).toBeInTheDocument();
    expect(blueskyIcon).toBeInTheDocument();
    expect(githubIcon).toBeInTheDocument();
    
    // Check the image sources
    expect(linkedinIcon).toHaveAttribute('src', '/image/2644994_linkedin_media_social_icon.png');
    expect(blueskyIcon).toHaveAttribute('src', '/image/Bluesky-Logo--Streamline-Flex.png');
    expect(githubIcon).toHaveAttribute('src', '/image/8666148_github_square_icon.png');
  });
});