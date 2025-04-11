import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom"; // Add this import
import AboutUsContainer from "../../src/components/AboutUsContainer";

describe("AboutUsContainer", () => {
  it("renders all team members", () => {
    render(<AboutUsContainer />);

    const expectedNames = [
      "Alec McGill",
      "Amritpal Chahal",
      "Aysin Akpinar",
      "Jack Misner",
      "Michal Podolak",
      "Zameer Mohamamed",
      "Ziaur Rahman",
    ];

    expectedNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders the correct number of AboutUs components", () => {
    const { container } = render(<AboutUsContainer />);
    const aboutUsComponents =
      container.getElementsByClassName("about-us-container")[0].children;
    expect(aboutUsComponents.length).toBe(7);
  });

  it("includes github links for all members", () => {
    render(<AboutUsContainer />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(7);
    expect(links[0]).toHaveAttribute("href", "https://github.com/AMcGill3");
  });
});
