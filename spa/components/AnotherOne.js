const AnotherOne = {
  render: ({ someVal = 'Haha' }) => {
    return `
      <p>Another One - ${someVal}</p>
    `;
  }
};

export default AnotherOne;
