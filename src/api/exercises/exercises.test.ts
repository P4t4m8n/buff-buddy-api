import request from "supertest";
import { app, server } from "../../server";

describe("Exercises API", () => {
  beforeAll(async () => {});

  it("should return all exercises", async () => {
    const res = await request(app).get("/api/v1/exercises");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should filter by name", async () => {
    const res = await request(app).get("/api/v1/exercises?name=Dumbbell");
    expect(res.status).toBe(200);
    expect(
      res.body.every((e: any) => {
        return e.name.includes("Dumbbell");
      })
    ).toBe(true);
  });

  it("should filter by muscle partial", async () => {
    const res = await request(app).get("/api/v1/exercises?muscles=ab");
    expect(res.status).toBe(200);
    expect(
      res.body.every((e: any) =>
        e.muscles.some((m: string) => m.includes("ab"))
      )
    ).toBe(true);
  });

  it("should filter by equipment partial", async () => {
    const res = await request(app).get("/api/v1/exercises?equipment=bar");
    expect(res.status).toBe(200);
    expect(
      res.body.every((e: any) =>
        e.equipment.some((eq: string) => eq.includes("bar"))
      )
    ).toBe(true);
  });

  it("should filter by type partial", async () => {
    const res = await request(app).get("/api/v1/exercises?types=str");
    expect(res.status).toBe(200);
    expect(
      res.body.every((e: any) => e.types.some((t: string) => t.includes("str")))
    ).toBe(true);
  });

  it("should return empty array for no matches", async () => {
    const res = await request(app).get("/api/v1/exercises?muscles=zzzz");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("should support pagination", async () => {
    const res = await request(app).get("/api/v1/exercises?page=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should support combined filters", async () => {
    const res = await request(app).get(
      "/api/v1/exercises?name=bench&muscles=ab&equipment=bar"
    );
    expect(res.status).toBe(200);

  });
  afterAll((done) => {
    server.close(done); 
  });
});
