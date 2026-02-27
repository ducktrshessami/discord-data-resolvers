import { InteractionType, APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType, ModalSubmitComponent, APIModalSubmissionComponent } from 'discord-api-types/v10';

interface RequiredOption<Required extends boolean = boolean> {
    required: Required;
}

type ApplicationCommandInteractionTypes = InteractionType.ApplicationCommand | InteractionType.ApplicationCommandAutocomplete;
type ExtractedOption<CommandInteractionType extends ApplicationCommandInteractionTypes, OptionType extends ApplicationCommandOptionType> = Extract<APIApplicationCommandInteractionDataOption<CommandInteractionType>, {
    type: OptionType;
}>;
type SubcommandOptionType = ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup;
type FocusableOptionType = Extract<APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>, {
    focused?: boolean;
}>["type"];
type AutocompleteFocusedOption<OptionType extends FocusableOptionType = FocusableOptionType> = Omit<ExtractedOption<InteractionType.ApplicationCommandAutocomplete, OptionType>, "focused"> & {
    focused: true;
};
interface BaseGetOptionQuery<OptionType extends ApplicationCommandOptionType> {
    name: string;
    type: OptionType;
}
declare class ApplicationCommandOptions<CommandInteractionType extends ApplicationCommandInteractionTypes> {
    private readonly _options;
    private _subcommand;
    private _group;
    private _focused;
    private mapOptions;
    constructor(options?: APIApplicationCommandInteractionDataOption<CommandInteractionType>[]);
    get<OptionType extends Exclude<ApplicationCommandOptionType, SubcommandOptionType>>(query: BaseGetOptionQuery<OptionType> & RequiredOption<true>): ExtractedOption<CommandInteractionType, OptionType>;
    get<OptionType extends Exclude<ApplicationCommandOptionType, SubcommandOptionType>>(query: BaseGetOptionQuery<OptionType> & Partial<RequiredOption>): ExtractedOption<CommandInteractionType, OptionType> | null;
    get subcommand(): string | null;
    get group(): string | null;
    getFocused(): AutocompleteFocusedOption;
}
declare function getSubcommand(options: APIApplicationCommandInteractionDataOption[] | undefined, required: true): string;
declare function getSubcommand(options: APIApplicationCommandInteractionDataOption[] | undefined, required?: boolean): string | null;
declare function getGroup(options: APIApplicationCommandInteractionDataOption[] | undefined, required: true): string;
declare function getGroup(options: APIApplicationCommandInteractionDataOption[] | undefined, required?: boolean): string | null;
declare function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] | undefined, required?: true): AutocompleteFocusedOption;
declare function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[] | undefined, required: boolean): AutocompleteFocusedOption | null;

type ModalSubmitFieldType = ModalSubmitComponent["type"];
type ExtractedField<FieldType extends ModalSubmitFieldType> = Extract<ModalSubmitComponent, {
    type: FieldType;
}>;
interface BaseGetFieldQuery<FieldType extends ModalSubmitFieldType> {
    type: FieldType;
    customId: string;
}
declare class ModalSubmitFields {
    private readonly _fields;
    constructor(components: APIModalSubmissionComponent[]);
    get<FieldType extends ModalSubmitFieldType>(query: BaseGetFieldQuery<FieldType> & Partial<RequiredOption<true>>): ExtractedField<FieldType>;
    get<FieldType extends ModalSubmitFieldType>(query: BaseGetFieldQuery<FieldType> & RequiredOption): ExtractedField<FieldType> | null;
}

export { ApplicationCommandOptions, type AutocompleteFocusedOption, type FocusableOptionType, type ModalSubmitFieldType, ModalSubmitFields, type SubcommandOptionType, getFocusedOption, getGroup, getSubcommand };
