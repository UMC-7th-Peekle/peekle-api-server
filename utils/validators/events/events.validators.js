export const postEventSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    price: { type: "number" },
    categoryId: { type: "number" },
    location: { type: "string" },
    locationGroupId: { type: "number" },
    eventUrl: { type: "string", format: "uri" },
    applicationStart: { type: "string", format: "date" },
    applicationEnd: { type: "string", format: "date" },
    schedules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          repeatType: {
            type: "string",
            enum: ["daily", "weekly", "monthly", "yearly"],
          },
          repeatEndDate: { type: ["string", "null"], format: "date" },
          isAllDay: { type: "boolean" },
          customText: { type: "string" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
          startTime: { type: "string", format: "time" },
          endTime: { type: "string", format: "time" },
        },
        required: [
          "repeatType",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
    },
  },
  required: [
    "title",
    "content",
    "price",
    "categoryId",
    "location",
    "locationGroupId",
    "eventUrl",
    "applicationStart",
    "applicationEnd",
    "schedules",
  ],
  additionalProperties: false,
};
export const patchEventSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    price: { type: "number" },
    categoryId: { type: "number" },
    location: { type: "string" },
    eventUrl: { type: "string", format: "uri" },
    applicationStart: { type: "string", format: "date" },
    applicationEnd: { type: "string", format: "date" },
    schedules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          repeatType: {
            type: "string",
            enum: ["daily", "weekly", "monthly", "yearly"],
          },
          repeatEndDate: { type: ["string", "null"], format: "date" },
          isAllDay: { type: "boolean" },
          customText: { type: "string" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
          startTime: { type: "string", format: "time" },
          endTime: { type: "string", format: "time" },
        },
        required: [
          "repeatType",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
    },
    existingImageSequence: { type: "array", items: { type: "number" } },
    newImageSequence: { type: "array", items: { type: "number" } },
  },
  required: [],
  additionalProperties: false,
};

export const scrapEventSchema = {
  type: "object",
  properties: {
    eventId: { type: "number" },
  },
  required: ["eventId"],
  additionalProperties: false,
};

export const reportEventSchema = {
  type: "object",
  properties: {
    eventId: { type: "number" },
    reason: { type: "string" },
  },
  required: ["eventId", "reason"],
  additionalProperties: false,
};
