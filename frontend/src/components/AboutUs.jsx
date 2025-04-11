const AboutUs = ({ name, github, picture }) => {
  return (
    <>
      <div className="about-us-card">
        <h3>{name}</h3>
        <a href={github} target="_blank" rel="noopener noreferrer">
          <img src={picture} alt={`${name}'s profile`} />
        </a>
      </div>
    </>
  );
};

export default AboutUs;
