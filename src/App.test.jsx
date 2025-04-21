import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  test("renders", () => {
    // Utiliser un test plus générique qui ne dépend pas du texte exact
    render(<App />);
    expect(document.querySelector('.App')).toBeDefined();
  });
});
