import {getJsonSchema, In, MethodPath} from "@tsed/schema";
import {expect} from "chai";
import {getSpec} from "../../utils/getSpec";
import {MaxProperties} from "./maxProperties";

describe("@MaxProperties", () => {
  it("should declare max value (any)", () => {
    // WHEN
    class Model {
      @MaxProperties(10)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          maxProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare max value (Map<any>)", () => {
    // WHEN
    class Model {
      @MaxProperties(10)
      prop: Map<string, any>;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          maxProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare max value on class", () => {
    // WHEN
    @MaxProperties(10)
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      maxProperties: 10,
      type: "object"
    });
  });
  it("should declare max value on param", () => {
    // WHEN
    class Model {
      @MethodPath("POST", "/")
      method(@In("body") @MaxProperties(10) test: any) {}
    }

    // THEN
    expect(getSpec(Model)).to.deep.equal({
      definitions: {},
      paths: {
        "/": {
          post: {
            parameters: [
              {
                in: "body",
                name: "body",
                required: false,
                schema: {
                  maxProperties: 10,
                  type: "object"
                }
              }
            ],
            responses: {
              "200": {
                description: ""
              }
            }
          }
        }
      }
    });
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    // WHEN
    let actualError: any;
    try {
      MaxProperties(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.equal("The value of maxProperties MUST be a non-negative integer.");
  });
});