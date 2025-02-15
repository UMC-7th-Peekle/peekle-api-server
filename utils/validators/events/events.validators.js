// 이벤트 생성 스키마
export const postEventSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    price: { type: "number" },
    categoryId: { type: "number" },
    location: {
      type: "object",
      properties: {
        locationGroupId: { type: "number" },
        roadAddress: { type: ["string", "null"] },
        jibunAddress: { type: ["string", "null"] },
        buildingCode: { type: ["string", "null"] },
        sido: { type: ["string", "null"] },
        sigungu: { type: ["string", "null"] },
        sigunguCode: { type: ["string", "null"] },
        roadnameCode: { type: ["string", "null"] },
        zoneCode: { type: ["string", "null"] },
        detail: { type: ["string", "null"] },
      },
      required: [
        "locationGroupId",
        "roadAddress",
        "jibunAddress",
        "buildingCode",
        "sido",
        "sigungu",
        "sigunguCode",
        "roadnameCode",
        "zoneCode",
        "detail",
      ],
    },
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
    "eventUrl",
    "applicationStart",
    "applicationEnd",
    "schedules",
  ],
  additionalProperties: false,
};

// 이벤트 수정 스키마
export const patchEventSchema = {
  ...postEventSchema,
  properties: {
    ...postEventSchema.properties,
    existingImageSequence: { type: "array", items: { type: "number" } },
    newImageSequence: { type: "array", items: { type: "number" } },
  },
  required: [],
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
