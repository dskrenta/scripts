import AnotherOne from './AnotherOne.js';

const About = {
  render: () => {
    return `
      <p>About</p>
      ${AnotherOne.render({ someVal: 'Something else!' })}
    `;
  }
};

export default About;
