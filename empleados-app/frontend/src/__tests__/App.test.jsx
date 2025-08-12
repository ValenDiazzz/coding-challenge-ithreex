import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";

// mock de axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn()
  }
}));
import axios from "axios";

const MOCK_DATA = [
  { id:1, full_name:"Ana Pérez", age:29, area:"Data", seniority_years:2, phone:"+54 9 351 111-1111" },
  { id:2, full_name:"Luis Gómez", age:34, area:"Data", seniority_years:5, phone:"+54 9 351 222-2222" },
  { id:3, full_name:"Marta Ruiz", age:41, area:"IT",   seniority_years:8, phone:"+54 9 351 333-3333" },
];

describe("App", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: MOCK_DATA });
  });

  it("renderiza áreas y conteos", async () => {
    render(<App />);
    // espera que aparezca un título de área (async por el fetch)
    const areaTitle = await screen.findByText(/Data — 2/i);
    expect(areaTitle).toBeInTheDocument();

    // verifica que IT tiene 1
    expect(screen.getByText(/IT — 1/i)).toBeInTheDocument();
  });

  it("abre el modal al hacer click en un empleado", async () => {
    render(<App />);
    const button = await screen.findByRole('button', { name: /Ana Pérez/i });
    await userEvent.click(button);
    expect(screen.getByRole('heading', { name: /Ana Pérez/i })).toBeInTheDocument();
    expect(screen.getByText(/Área/)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/)).toBeInTheDocument();
  });
});
