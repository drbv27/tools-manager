// src/components/ui/__tests__/Button.test.tsx
import { render, screen } from "@testing-library/react"; // Importar render y screen
import { Button } from "../button"; // Asegúrate de que esta ruta sea correcta

describe("Button component", () => {
  it("renders a button with text content", () => {
    render(<Button>Click me</Button>);
    // Utiliza getByRole para buscar el botón
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    // toBeInTheDocument es un matcher de jest-dom
    expect(buttonElement).toBeInTheDocument();
  });

  it("renders a disabled button when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);
    const buttonElement = screen.getByRole("button", {
      name: /disabled button/i,
    });
    // toBeDisabled es un matcher de jest-dom
    expect(buttonElement).toBeDisabled();
  });

  it("renders a button with a specific variant", () => {
    // Para variantes, es más difícil probar clases CSS exactas debido a `cva`
    // Solo verificamos que se renderiza el botón
    render(<Button variant="secondary">Secondary button</Button>);
    const buttonElement = screen.getByRole("button", {
      name: /secondary button/i,
    });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).not.toBeDisabled();
  });
});
