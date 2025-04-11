import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HomePage } from "../../src/pages/Home/HomePage";
import { MemoryRouter } from "react-router-dom";
describe("HomePage", () => {
  it("renders welcome message", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const element = screen.getByText("Welcome to Acebook!");
    expect(element).toBeTruthy();
  });
  it("renders who we are message", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const element = screen.getByText("Who we are");
    expect(element).toBeTruthy();
  });
  it("renders many thanks message", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const element = screen.getByText("Many thanks from the acebook dev team!");
    expect(element).toBeTruthy();
  });
});
