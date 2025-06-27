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

describe("POST /api/v1/exercises/edit", () => {
  let createdExerciseId: string;

  it("should create a new exercise", async () => {
    const newExercise = {
      name: "Test Exercise",
      youtubeUrl: "https://www.youtube.com/watch?v=test123",
      types: ["strength"],
      equipment: ["dumbbell"],
      muscles: ["biceps"],
    };

    const createRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(newExercise);
    createdExerciseId = createRes.body.data.id;

    expect(createRes.status).toBe(201);
    expect(createRes.body.message).toBe("Exercise created successfully");
    expect(createRes.body.data).toHaveProperty("id");
    expect(createRes.body.data.name).toBe(newExercise.name);
    expect(createRes.body.data.youtubeUrl).toBe(newExercise.youtubeUrl);
  });

  it("should reject exercise with invalid data", async () => {
    const invalidExercise = {
      name: "",
      youtubeUrl: "invalid-url",
      types: [],
      equipment: [],
      muscles: [],
    };

    const createRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(invalidExercise);

    expect(createRes.status).toBe(400);
    expect(createRes.body).toHaveProperty("errors");
  });
  afterAll(async () => {
    if (createdExerciseId) {
      try {
        await request(app).delete(`/api/v1/exercises/${createdExerciseId}`);
      } catch (error) {}
    }
  });
  afterAll((done) => {
    server.close(done);
  });
});

describe("GET /api/v1/exercises/:id", () => {
  let createdExerciseId: string;

  beforeAll(async () => {
    const newExercise = {
      name: "Test GetById Exercise",
      youtubeUrl: "https://www.youtube.com/watch?v=getbyid123",
      types: ["cardio"],
      equipment: ["none"],
      muscles: ["core"],
    };

    const createRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(newExercise);

    createdExerciseId = createRes.body.data.id;
  });

  it("should get exercise by id", async () => {
    const res = await request(app).get(
      `/api/v1/exercises/${createdExerciseId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id", createdExerciseId);
    expect(res.body.data.name).toBe("Test GetById Exercise");
  });

  it("should return 404 for non-existent exercise", async () => {
    const res = await request(app).get("/api/v1/exercises/non-existent-id");

    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    if (createdExerciseId) {
      try {
        await request(app).delete(`/api/v1/exercises/${createdExerciseId}`);
      } catch (error) {}
    }
  });

  afterAll((done) => {
    server.close(done);
  });
});

describe("PUT /api/v1/exercises/edit/:id", () => {
  let createdExerciseId: string;

  beforeAll(async () => {
    const newExercise = {
      name: "Test Update Exercise",
      youtubeUrl: "https://www.youtube.com/watch?v=update123",
      types: ["strength"],
      equipment: ["dumbbell"],
      muscles: ["triceps"],
    };

    const createRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(newExercise);

    createdExerciseId = createRes.body.data.id;
  });

  it("should update exercise", async () => {
    const updateData = {
      name: "Updated Exercise Name",
      muscles: ["biceps", "triceps"],
    };

    const res = await request(app)
      .put(`/api/v1/exercises/edit/${createdExerciseId}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Exercise Name");
    expect(res.body.data.muscles).toContain("biceps");
    expect(res.body.data.muscles).toContain("triceps");
  });

  it("should return 404 for updating non-existent exercise", async () => {
    const updateData = {
      name: "Updated Name",
    };

    const res = await request(app)
      .put("/api/v1/exercises/edit/non-existent-id")
      .send(updateData);

    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    if (createdExerciseId) {
      try {
        await request(app).delete(`/api/v1/exercises/${createdExerciseId}`);
      } catch (error) {}
    }
  });

  afterAll((done) => {
    server.close(done);
  });
});

describe("DELETE /api/v1/exercises/:id", () => {
  let createdExerciseId: string;

  beforeAll(async () => {
    const newExercise = {
      name: "Test Delete Exercise",
      youtubeUrl: "https://www.youtube.com/watch?v=delete123",
      types: ["flexibility"],
      equipment: ["none"],
      muscles: ["back"],
    };

    const createRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(newExercise);

    createdExerciseId = createRes.body.data.id;
  });

  it("should delete exercise", async () => {
    const res = await request(app).delete(
      `/api/v1/exercises/${createdExerciseId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Exercise deleted successfully");

    const getRes = await request(app).get(
      `/api/v1/exercises/${createdExerciseId}`
    );
    expect(getRes.status).toBe(404);
  });

  it("should return 400 for deleting non-existent exercise", async () => {
    const res = await request(app).delete("/api/v1/exercises/non-existent-id");

    expect(res.status).toBe(400);
  });
  afterAll((done) => {
    server.close(done);
  });
});
