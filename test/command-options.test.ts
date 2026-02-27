import { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType } from "discord-api-types/v10";
import { describe, expect, it } from "vitest";
import * as lib from "../dist/index";

const bool: APIApplicationCommandInteractionDataOption = {
    value: true,
    type: ApplicationCommandOptionType.Boolean,
    name: "bool"
};
const focused: APIApplicationCommandInteractionDataOption = {
    value: "foo",
    type: ApplicationCommandOptionType.String,
    name: "str",
    focused: true
};
const subcommand: APIApplicationCommandInteractionDataOption = {
    type: ApplicationCommandOptionType.Subcommand,
    name: "subcmd",
    options: [bool, focused]
};
const group: APIApplicationCommandInteractionDataOption = {
    type: ApplicationCommandOptionType.SubcommandGroup,
    name: "group",
    options: [subcommand]
};
const data: APIApplicationCommandInteractionDataOption[] = [group];

describe("ApplicationCommandOptions", function () {
    it("should resolve options", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(options.get({
            type: ApplicationCommandOptionType.Boolean,
            name: "bool",
            required: true
        })).toEqual(bool);
    });

    it("should default required to false", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(options.get({
            type: ApplicationCommandOptionType.Boolean,
            name: "missing"
        })).toEqual(null);
    });

    it("should throw if required option is not found", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(() => options.get({
            type: ApplicationCommandOptionType.Boolean,
            name: "missing",
            required: true
        })).toThrowError("Unable to find required option: missing");
    });

    it("should throw if option type does not match", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(() => options.get({
            type: ApplicationCommandOptionType.String,
            name: "bool"
        })).toThrowError("Expected option type String. Received: Boolean");
    });

    it("should resolve subcommand and subcommand group", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(options.subcommand).toEqual(subcommand.name);
        expect(options.group).toEqual(group.name);
    });

    it("should resolve the focused option", function () {
        const options = new lib.ApplicationCommandOptions(data);
        expect(options.getFocused()).toEqual(focused);
    });
});

describe("util fn", function () {
    it("getSubcommand", function () {
        expect(lib.getSubcommand(data)).toEqual(subcommand.name);
    });

    it("getGroup", function () {
        expect(lib.getGroup(data)).toEqual(group.name);
    });

    it("getFocusedOption", function () {
        expect(lib.getFocusedOption(data)).toEqual(focused);
    });
});
