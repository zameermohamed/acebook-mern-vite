import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../../src/pages/Home/HomePage";

describe("Home Page", () => {
  test("welcomes you to the site", () => {
    // We need the Browser Router so that the Link elements load correctly
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    const heading = screen.getByRole("heading");
    expect(heading.textContent).toEqual("Welcome to Acebook!");
  });
});
