import { Project, Tech } from '../data.model';

describe('Data Model Types', () => {
  test('Project interface can be implemented', () => {
    const project: Project = {
      _id: '1',
      projName: 'Test Project',
      description: 'A test project description',
      imgSrc: '/images/test.jpg',
      tech: [{ techName: 'React' }]
    };

    expect(project._id).toBe('1');
    expect(project.projName).toBe('Test Project');
    expect(project.description).toBe('A test project description');
    expect(project.imgSrc).toBe('/images/test.jpg');
    expect(project.tech.length).toBe(1);
    expect(project.tech[0].techName).toBe('React');
  });

  test('Project can include optional link property', () => {
    const projectWithLink: Project = {
      _id: '2',
      projName: 'Project with Link',
      description: 'This project has a link',
      imgSrc: '/images/test2.jpg',
      link: 'https://example.com',
      tech: []
    };

    expect(projectWithLink.link).toBe('https://example.com');
  });

  test('Tech interface can be implemented', () => {
    const tech: Tech = {
      techName: 'TypeScript'
    };

    expect(tech.techName).toBe('TypeScript');
  });
});