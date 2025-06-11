import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import OrderServePage from "../app/operator/order/[id]/page"; // Adjust this path to your file location
import { useParams } from "next/navigation";
import '@testing-library/jest-dom'

// Mock next/navigation's useParams
jest.mock("next/navigation", () => ({
  useParams: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

const mockOrder = {
  id: "order123",
  eventTitle: "Sample Event",
  items: [
    { name: "Item A", price: 10, quantity: 2, served: 1 },
    { name: "Item B", price: 5, quantity: 3, served: 3 },
  ],
};

describe("Order Component", () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: "order123" });
    (fetch as jest.Mock).mockResolvedValue({`
      json: jest.fn().mockResolvedValue(mockOrder),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async() => {
    render(<OrderServePage />);

    expect(await waitFor(() => screen.getByText("Loading ..."))).toBeInTheDocument();
  });

  test("renders order details correctly", async () => {
    render(<OrderServePage />);

    // Wait for data to load
    await waitFor(() => screen.getByText("Item A"));

    // Items rendered
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
  });

  // test("renders QR code with order ID", async () => {
  //   render(<OrderServePage />);
  //   await waitFor(() => screen.getByText("Sample Event"));

  //   const qrCode = screen.getByRole("img");
  //   expect(qrCode).toBeInTheDocument();
  // });
});
