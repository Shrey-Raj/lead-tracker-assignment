import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";

describe("Leads API Endpoints", () => {
  let consoleSpy;

  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lead_tracker_test";
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    if (consoleSpy) consoleSpy.mockRestore();
    await mongoose.connection.close();
  });

  it("GET /api/v1/leads/list - should return list of leads and status 200", async () => {
    const response = await request(app).get("/api/v1/leads/list");
    expect(response.status).toBe(200);
  });

  it("POST /api/v1/leads/create - should fail validation when required fields are missing", async () => {
    const invalidLeadPayload = {
      email: "invalid-email-format",
    };

    const response = await request(app)
      .post("/api/v1/leads/create")
      .send(invalidLeadPayload);

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /api/v1/leads/search - should return search results and status 200", async () => {
    const response = await request(app)
      .get("/api/v1/leads/search")
      .query({ query: "test" });

    expect(response.status).toBe(200);
  });

  it("GET /api/v1/leads/metrics - should return metrics object", async () => {
    const response = await request(app).get("/api/v1/leads/metrics");
    expect(response.status).toBe(200);
  });
});