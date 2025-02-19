export const createPeeklingSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    minPeople: { type: "integer", minimum: 3, maximum: 50 },
    maxPeople: { type: "integer", minimum: 3, maximum: 50 },
    schedule: { type: "string", format: "date-time" },
    location: { type: "string" },
    categoryId: { type: "string" },
  },
  required: [
    "minPeople",
    "maxPeople",
    "schedule",
    "location",
    "categoryId",
    "title",
    "description",
  ],
  additionalProperties: false,
};
