import request from "supertest";
import { app } from "../src/app.js";

describe("GET /health", () => {
	it("responds successfully to GET /health", async () => {
		const response = await request(app).get("/health");

		expect(response.status).toBe(200);
	});
});

describe("unknown routes", () => {
	it("returns 404 for a route that does not exist", async () => {
		const response = await request(app).get("/ruta-inexistente");

		expect(response.status).toBe(404);
	});
});
