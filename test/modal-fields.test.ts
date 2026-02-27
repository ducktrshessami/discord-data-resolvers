import { APIModalSubmissionComponent, APIModalSubmitTextInputComponent, ComponentType, ModalSubmitLabelComponent } from "discord-api-types/v10";
import { describe, expect, it } from "vitest";
import * as lib from "../dist/index";

const text: APIModalSubmitTextInputComponent = {
    value: "Foobar",
    type: ComponentType.TextInput,
    custom_id: "text_input"
};
const textLabel: ModalSubmitLabelComponent = {
    type: ComponentType.Label,
    component: text
};
const data: APIModalSubmissionComponent[] = [textLabel];

describe("ModalSubmitFields", function () {
    it("should resolve modal fields", function () {
        const fields = new lib.ModalSubmitFields(data);
        expect(fields.get({
            type: ComponentType.TextInput,
            customId: "text_input"
        })).toEqual(text);
        expect(fields.get({
            type: ComponentType.TextInput,
            customId: "missing",
            required: false
        })).toEqual(null);
    });

    it("should default require to true and throw if not found", function () {
        const fields = new lib.ModalSubmitFields(data);
        expect(() => fields.get({
            type: ComponentType.TextInput,
            customId: "missing"
        })).toThrowError("Unable to find required field: missing");
    });

    it("should throw if field type does not match", function () {
        const fields = new lib.ModalSubmitFields(data);
        expect(() => fields.get({
            type: ComponentType.RadioGroup,
            customId: "text_input"
        })).toThrowError("Expected field type RadioGroup. Received: TextInput");
    });
});
