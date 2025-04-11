import AboutUs from "./AboutUs";
import "./AboutUs.css";
const AboutUsContainer = () => {
  const us = [
    {
      name: "Alec McGill",
      github: "https://github.com/AMcGill3",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U0892FD1SH2-86ad26fdcf23-512",
    },
    {
      name: "Amritpal Chahal",
      github: "https://github.com/AmritpalC",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U089649Q1B6-a66c0b0f2581-512",
    },
    {
      name: "Aysin Akpinar",
      github: "https://github.com/aysinakpinar",
      picture: "https://avatars.githubusercontent.com/u/186265762?v=4",
    },
    {
      name: "Jack Misner",
      github: "https://github.com/jackmisner",
      picture: "https://avatars.githubusercontent.com/u/189114969?v=4",
    },
    {
      name: "Michal Podolak",
      github: "https://github.com/Michal-P-1",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U08188F7N01-a99979029cde-512",
    },
    {
      name: "Zameer Mohamamed",
      github: "https://github.com/zameermohamed",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U089G9FCB09-04f19359577d-512",
    },
    {
      name: "Ziaur Rahman",
      github: "https://github.com/ziaxgit",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U0890PA5T9B-ceada4d19fcb-512",
    },
  ];
  return (
    <div className="about-us-container">
      {us.map(({ name, github, picture }) => (
        <AboutUs key={name} name={name} github={github} picture={picture} />
      ))}
    </div>
  );
};

export default AboutUsContainer;
