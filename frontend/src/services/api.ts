import axios from "axios";

const API = axios.create({
  baseURL: "https://pakwheels-backend.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

// Auth
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth", { ...data, isLogin: true });

// Users
export const signupUser = (data: { name: string; phone: string; email: string; password: string }) =>
  API.post("/users", { ...data, isLogin: false });

export const getUsers = (token: string) =>
  API.get("/users", { headers: { Authorization: `Bearer ${token}` } });

export const getUserById = (id: number, token: string) =>
  API.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateUser = (id: number, data: { name?: string; phone?: string }, token: string) =>
  API.put(`/users/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteUser = (id: number, token: string) =>
  API.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Cars
export const createCar = (formData: FormData, token: string) =>
  API.post("/cars", formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

import type { Car } from "../types/Car";

export const getCars = async (): Promise<Car[]> => {
  const response = await API.get("/cars");
  // Map API response to only required fields
  return response.data.data.map((car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    location: string;
    condition: string;
  }) => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    imageUrl: car.imageUrl,
    location: car.location,
    condition: car.condition,
  }));
};

export const getCarById = (id: number) => API.get(`/cars/${id}`);

export const updateCar = (id: number, formData: FormData, token: string) =>
  API.put(`/cars/${id}`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

export const deleteCar = (id: number, token: string) =>
  API.delete(`/cars/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Wishlist
export const addToWishlist = (carId: number, token: string) =>
  API.post("/wishlist", { carId }, { headers: { Authorization: `Bearer ${token}` } });

export const getWishlist = (token: string) =>
  API.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } });

export const removeFromWishlist = (carId: number, token: string) =>
  API.delete("/wishlist", { data: { carId }, headers: { Authorization: `Bearer ${token}` } });
