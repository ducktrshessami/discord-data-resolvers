import { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType, InteractionType } from "discord-api-types/v10";
import { ApplicationCommandOptionResolutionError } from "./error";
import { RequiredOption } from "./util";

type ApplicationCommandInteractionTypes = InteractionType.ApplicationCommand | InteractionType.ApplicationCommandAutocomplete;
type ExtractedOption<CommandInteractionType extends ApplicationCommandInteractionTypes, OptionType extends ApplicationCommandOptionType> = Extract<APIApplicationCommandInteractionDataOption<CommandInteractionType>, { type: OptionType; }>;
export type SubcommandOptionType = ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup;
export type FocusableOptionType = Extract<APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>, { focused?: boolean }>["type"];
export type AutocompleteFocusedOption<OptionType extends FocusableOptionType = FocusableOptionType> = Omit<ExtractedOption<InteractionType.ApplicationCommandAutocomplete, OptionType>, "focused"> & { focused: true };
interface BaseGetOptionQuery<OptionType extends ApplicationCommandOptionType> {
    name: string;
    type: OptionType;
}

function isFocusedOption(option: APIApplicationCommandInteractionDataOption): option is AutocompleteFocusedOption {
    return "focused" in option && !!option.focused;
}

export class ApplicationCommandOptions<CommandInteractionType extends ApplicationCommandInteractionTypes> {
    private readonly _options: Map<string, APIApplicationCommandInteractionDataOption<CommandInteractionType>>;
    private _subcommand: string | null;
    private _group: string | null;
    private _focused: string | null;

    private mapOptions(options: APIApplicationCommandInteractionDataOption<CommandInteractionType>[] | undefined): void {
        options?.forEach(option => {
            switch (true) {
                case option.type === ApplicationCommandOptionType.Subcommand: this._subcommand = option.name; break;
                case option.type === ApplicationCommandOptionType.SubcommandGroup: this._group = option.name; break;
                default:
                    if (isFocusedOption(option)) {
                        this._focused = option.name;
                    }
                    this._options.set(option.name, option);
                    break;
            }
            if ("options" in option) {
                this.mapOptions(option.options);
            }
        });
    }

    constructor(options?: APIApplicationCommandInteractionDataOption<CommandInteractionType>[]) {
        this._options = new Map<string, APIApplicationCommandInteractionDataOption<CommandInteractionType>>();
        this._subcommand = null;
        this._group = null;
        this._focused = null;
        this.mapOptions(options);
    }

    get<OptionType extends Exclude<ApplicationCommandOptionType, SubcommandOptionType>>(query: BaseGetOptionQuery<OptionType> & RequiredOption<true>): ExtractedOption<CommandInteractionType, OptionType>;
    get<OptionType extends Exclude<ApplicationCommandOptionType, SubcommandOptionType>>(query: BaseGetOptionQuery<OptionType> & Partial<RequiredOption>): ExtractedOption<CommandInteractionType, OptionType> | null;
    get<OptionType extends Exclude<ApplicationCommandOptionType, SubcommandOptionType>>(query: BaseGetOptionQuery<OptionType> & Partial<RequiredOption>): ExtractedOption<CommandInteractionType, OptionType> | null {
        const option = this._options.get(query.name) ?? null;
        if (query.required && !option) {
            throw new ApplicationCommandOptionResolutionError(`Unable to find required option: ${query.name}`);
        }
        if (option && option.type !== query.type) {
            throw new ApplicationCommandOptionResolutionError(`Expected option type ${ApplicationCommandOptionType[query.type]}. Received: ${ApplicationCommandOptionType[option.type]}`);
        }
        return <ExtractedOption<CommandInteractionType, OptionType> | null>option;
    }

    get subcommand(): string | null {
        return this._subcommand;
    }

    get group(): string | null {
        return this._group;
    }

    getFocused(): AutocompleteFocusedOption {
        if (!this._focused) {
            throw new ApplicationCommandOptionResolutionError("Unabled to find focused option");
        }
        return <AutocompleteFocusedOption>this._options.get(this._focused)!;
    }
}

function findOption<T extends APIApplicationCommandInteractionDataOption>(
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    test: (option: APIApplicationCommandInteractionDataOption) => option is T,
    errIfNotFound: string
): T;
function findOption(
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    test: (option: APIApplicationCommandInteractionDataOption) => boolean,
    errIfNotFound: string
): APIApplicationCommandInteractionDataOption;
function findOption<T extends APIApplicationCommandInteractionDataOption>(
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    test: (option: APIApplicationCommandInteractionDataOption) => option is T,
    errIfNotFound?: string
): T | null;
function findOption(
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    test: (option: APIApplicationCommandInteractionDataOption) => boolean,
    errIfNotFound?: string
): APIApplicationCommandInteractionDataOption | null;
function findOption(
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    test: (option: APIApplicationCommandInteractionDataOption) => boolean,
    errIfNotFound?: string
): APIApplicationCommandInteractionDataOption | null {
    if (options) {
        for (const option of options) {
            if (test(option)) {
                return option;
            }
            if ("options" in option) {
                const found = findOption(option.options, test);
                if (found) {
                    return found;
                }
            }
        }
    }
    if (errIfNotFound) {
        throw new ApplicationCommandOptionResolutionError(errIfNotFound);
    }
    return null;
}

export function getSubcommand(options: APIApplicationCommandInteractionDataOption[] | undefined, required: true): string;
export function getSubcommand(options: APIApplicationCommandInteractionDataOption[] | undefined, required?: boolean): string | null;
export function getSubcommand(options: APIApplicationCommandInteractionDataOption[] | undefined, required: boolean = false): string | null {
    const subcommand = findOption(options, option => option.type === ApplicationCommandOptionType.Subcommand, required ? "Unable to find subcommand" : undefined);
    return subcommand?.name ?? null;
}

export function getGroup(options: APIApplicationCommandInteractionDataOption[] | undefined, required: true): string;
export function getGroup(options: APIApplicationCommandInteractionDataOption[] | undefined, required?: boolean): string | null;
export function getGroup(options: APIApplicationCommandInteractionDataOption[] | undefined, required: boolean = false): string | null {
    const group = findOption(options, option => option.type === ApplicationCommandOptionType.SubcommandGroup, required ? "Unable to find group" : undefined);
    return group?.name ?? null;
}

export function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] | undefined, required?: true): AutocompleteFocusedOption;
export function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] | undefined, required: boolean): AutocompleteFocusedOption | null;
export function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] | undefined, required: boolean = true): AutocompleteFocusedOption | null {
    return findOption(options, isFocusedOption, required ? "Unabled to find focused option" : undefined);
}
