var demoSchema = {
  $schema: "http://json-schema.org/schema#",
  title: "Store",
  type: "object",
  properties: {
    "basic-input": {
      title: "Basic input page",
      type: "object",
      properties: {
        branch: { title: "Branch", type: "string" },
        name: { title: "Name", type: "string" },
        address: { title: "Address", type: "string", minLength: 3 },
        city: { title: "City", type: "string", minLength: 3 },
        province: { title: "Province", type: "string", minLength: 2 },
        country: { title: "Country", type: "string", minLength: 2 },
        postalCode: {
          title: "Postal/Zip Code",
          type: "string",
          pattern:
            "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?"
        },
        email: {
          title: "Email",
          type: "string",
          pattern:
            "(?:^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$)|(?:^$)"
        },
        website: { title: "Website", type: "string", format: "uri" },
        establishedDate: {
          title: "Established Date",
          type: "string",
          format: "date-time"
        },
        closedDate: {
          title: "Closed Date",
          type: ["string", "null"],
          format: "date-time"
        }
      }
    },
    arrays: {
      title: "Basic arrays page",
      type: "object",
      properties: {
        phoneNumbers: {
          title: "Phone numbers",
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { title: "Type", type: "string" },
              phoneNumber: { title: "Phone Number", type: "string" }
            }
          }
        },
        positions: {
          type: "array",
          title: "Positions",
          items: {
            type: "object",
            title: "Positions",
            properties: {
              title: { title: "Title", type: "string" },
              salary: {
                title: "Salary",
                type: "number",
                multipleOf: 1e3,
                minimum: 2e4,
                maximum: 5e4
              }
            }
          }
        },
        geo: {
          title: "Geo coordinates",
          type: "array",
          description:
            "The geo coordinates of this location, first item being the longitude, second the latitude",
          items: { type: "number" }
        },
        services: {
          title: "Services",
          type: "array",
          description: "Services this business offers (ex. walk-in)",
          items: { type: "string" }
        }
      }
    },
    object: {
      title: "Basic object page",
      type: "object",
      properties: {
        hoursOfOperation: {
          title: "Hours of operation",
          type: "object",
          description:
            "Hours of operation are denoted using day of the week as the key and hour as the value. Hour should be in 24 hours format.",
          properties: {
            Sun: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Mon: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Tue: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Wed: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Thu: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Fri: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            },
            Sat: {
              type: "array",
              items: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
};
