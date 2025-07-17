// src/hooks/__tests__/useDebounce.test.ts
import { renderHook, act } from "@testing-library/react"; // <-- CAMBIO CLAVE: Importar de @testing-library/react

// Importamos el hook a probar
import { useDebounce } from "../useDebounce";

// Mock del temporizador para pruebas con hooks que usan setTimeout
jest.useFakeTimers();

describe("useDebounce hook", () => {
  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("should not update the debounced value until after the delay", () => {
    const { result, rerender } = renderHook(
      // <-- CAMBIO CLAVE: Tipar value y delay
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "changed", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe("changed");
  });

  it("should debounce multiple rapid value changes", () => {
    const { result, rerender } = renderHook(
      // <-- CAMBIO CLAVE: Tipar value y delay
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: "one", delay: 500 },
      }
    );

    expect(result.current).toBe("one");

    rerender({ value: "two", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    rerender({ value: "three", delay: 500 });

    expect(result.current).toBe("one");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("three");
  });

  it("should reset the timer if value changes before delay is over", () => {
    const { result, rerender } = renderHook(
      // <-- CAMBIO CLAVE: Tipar value y delay
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: { value: "start", delay: 1000 },
      }
    );

    expect(result.current).toBe("start");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    rerender({ value: "new value", delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("start");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("new value");
  });
});
