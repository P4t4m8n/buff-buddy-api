import request from "supertest";
import { app, server } from "../../server";

describe("Programs API", () => {
  let testExerciseId: string;
  const createdProgramIds: string[] = [];

  beforeAll(async () => {
    const testExercise = {
      name: "Test Program Exercise",
      youtubeUrl: "https://www.youtube.com/watch?v=test123",
      types: ["strength"],
      equipment: ["dumbbell"],
      muscles: ["chest"],
    };

    const exerciseRes = await request(app)
      .post("/api/v1/exercises/edit")
      .send(testExercise);

    testExerciseId = exerciseRes.body.data.id;
  });

  describe("GET /api/v1/programs", () => {
    it("should return all programs", async () => {
      const res = await request(app).get("/api/v1/programs");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should filter programs by name", async () => {
      const res = await request(app).get("/api/v1/programs?name=Test");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/v1/programs/edit", () => {
    it("should create a new program with nested programExercises and coreSets", async () => {
      const newProgram = {
        name: "Test Workout Program",
        notes: "This is a test program",
        startDate: "2025-01-01",
        endDate: "2025-03-01",
        isActive: true,
        programExercises: [
          {
            order: 1,
            notes: "Focus on form",
            daysOfWeek: ["monday", "wednesday", "friday"],
            exerciseId: testExerciseId,
            isActive: true,
            crudOperation: "create",
            coreSets: [
              {
                reps: 10,
                weight: 135.5,
                restTime: 120,
                order: 1,
                isWarmup: false,
                repsInReserve: 2,
                crudOperation: "create",
              },
              {
                reps: 8,
                weight: 145.0,
                restTime: 150,
                order: 2,
                isWarmup: false,
                repsInReserve: 1,
                crudOperation: "create",
              },
            ],
          },
          {
            order: 2,
            notes: "Warm up set",
            daysOfWeek: ["monday"],
            exerciseId: testExerciseId,
            isActive: true,
            crudOperation: "create",
            coreSets: [
              {
                reps: 15,
                weight: 95.0,
                restTime: 60,
                order: 1,
                isWarmup: true,
                repsInReserve: 5,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const res = await request(app)
        .post("/api/v1/programs/edit")
        .send(newProgram);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Program created successfully");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(newProgram.name);
      expect(res.body.data.notes).toBe(newProgram.notes);

      createdProgramIds.push(res.body.data.id);
    });

    it("should reject program with invalid data", async () => {
      const invalidProgram = {
        name: "",
        startDate: "invalid-date",
        endDate: "2025-01-01",
        programExercises: [],
      };

      const res = await request(app)
        .post("/api/v1/programs/edit")
        .send(invalidProgram);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should reject program with end date before start date", async () => {
      const invalidProgram = {
        name: "Invalid Date Program",
        startDate: "2025-03-01",
        endDate: "2025-01-01",
        programExercises: [
          {
            order: 1,
            daysOfWeek: ["monday"],
            exerciseId: testExerciseId,
            crudOperation: "create",
            coreSets: [
              {
                reps: 10,
                weight: 100,
                restTime: 60,
                order: 1,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const res = await request(app)
        .post("/api/v1/programs/edit")
        .send(invalidProgram);

      expect(res.status).toBe(400);
      expect(res.body.errors.endDate).toContain(
        "End date must be after start date"
      );
    });
  });

  describe("GET /api/v1/programs/:id", () => {
    let createdProgramId: string;

    beforeAll(async () => {
      const newProgram = {
        name: "Test GetById Program",
        note: "Program for testing getById",
        startDate: "2025-02-01",
        endDate: "2025-04-01",
        programExercises: [
          {
            order: 1,
            daysOfWeek: ["tuesday"],
            exerciseId: testExerciseId,
            crudOperation: "create",
            coreSets: [
              {
                reps: 12,
                weight: 120,
                restTime: 90,
                order: 1,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const createRes = await request(app)
        .post("/api/v1/programs/edit")
        .send(newProgram);

      createdProgramId = createRes.body.data.id;
      createdProgramIds.push(createdProgramId);
    });

    it("should get program by id with nested data", async () => {
      const res = await request(app).get(
        `/api/v1/programs/${createdProgramId}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", createdProgramId);
      expect(res.body.name).toBe("Test GetById Program");
      expect(res.body.programExercises).toHaveLength(1);
      expect(res.body.programExercises[0].coreSets).toHaveLength(1);
      expect(res.body.programExercises[0].exercise).toHaveProperty(
        "id",
        testExerciseId
      );
    });

    it("should return 404 for non-existent program", async () => {
      const res = await request(app).get("/api/v1/programs/non-existent-id");
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/v1/programs/edit/:id", () => {
    let createdProgramId: string;

    beforeAll(async () => {
      const newProgram = {
        name: "Test Update Program",
        notes: "Program for testing updates",
        startDate: "2025-03-01",
        endDate: "2025-05-01",
        programExercises: [
          {
            order: 1,
            daysOfWeek: ["thursday"],
            exerciseId: testExerciseId,
            crudOperation: "create",
            coreSets: [
              {
                reps: 8,
                weight: 155,
                restTime: 180,
                order: 1,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const createRes = await request(app)
        .post("/api/v1/programs/edit")
        .send(newProgram);

      createdProgramId = createRes.body.data.id;
      createdProgramIds.push(createdProgramId);
    });

    it("should update program with nested data", async () => {
      const updateData = {
        name: "Updated Program Name",
        notes: "Updated program description",
        programExercises: [
          {
            order: 1,
            notes: "Updated exercise notes",
            daysOfWeek: ["thursday", "saturday"],
            exerciseId: testExerciseId,
            crudOperation: "update",
            coreSets: [
              {
                reps: 10,
                weight: 165,
                restTime: 150,
                order: 1,
                crudOperation: "update",
              },
              {
                reps: 6,
                weight: 175,
                restTime: 200,
                order: 2,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const res = await request(app)
        .put(`/api/v1/programs/edit/${createdProgramId}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Program updated successfully");
      expect(res.body.data.name).toBe("Updated Program Name");
      expect(res.body.data.notes).toBe("Updated program description");
    });

    it("should return 400 for updating non-existent program", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const res = await request(app)
        .put("/api/v1/programs/edit/non-existent-id")
        .send(updateData);

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/programs/edit/:id", () => {
    let createdProgramId: string;

    beforeAll(async () => {
      const newProgram = {
        name: "Test Delete Program",
        note: "Program for testing deletion",
        startDate: "2025-04-01",
        endDate: "2025-06-01",
        programExercises: [
          {
            order: 1,
            daysOfWeek: ["sunday"],
            exerciseId: testExerciseId,
            crudOperation: "create",
            coreSets: [
              {
                reps: 15,
                weight: 75,
                restTime: 45,
                order: 1,
                crudOperation: "create",
              },
            ],
          },
        ],
      };

      const createRes = await request(app)
        .post("/api/v1/programs/edit")
        .send(newProgram);

      createdProgramId = createRes.body.data.id;
    });

    it("should delete program and all nested data", async () => {
      const res = await request(app).delete(
        `/api/v1/programs/${createdProgramId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Program deleted successfully");

      // Verify program is deleted
      const getRes = await request(app).get(
        `/api/v1/programs/${createdProgramId}`
      );
      expect(getRes.status).toBe(404);
    });

    it("should return 400 for deleting non-existent program", async () => {
      const res = await request(app).delete("/api/v1/programs/non-existent-id");
      expect(res.status).toBe(400);
    });
  });

  afterAll(async () => {
    for (const id of createdProgramIds) {
      try {
        await request(app).delete(`/api/v1/programs/${id}`);
      } catch (error) {}
    }

    if (testExerciseId) {
      try {
        await request(app).delete(`/api/v1/exercises/${testExerciseId}`);
      } catch (error) {}
    }

  });
});
