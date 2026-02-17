import { InteractionType, APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType, ModalSubmitComponent, APIModalSubmissionComponent } from 'discord-api-types/v10';

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
interface RequiredOption<Required extends boolean = boolean> {
    required: Required;
}
declare function isFocusedOption(option: APIApplicationCommandInteractionDataOption): option is AutocompleteFocusedOption;
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
declare function getFocusedOption(options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommandAutocomplete>[]): AutocompleteFocusedOption;

interface FindModalFieldQuery<Type extends ModalSubmitComponent["type"]> {
    type: Type;
    customId: string;
}
declare function findModalField<Type extends ModalSubmitComponent["type"]>(components: APIModalSubmissionComponent[], options: FindModalFieldQuery<Type>): Extract<ModalSubmitComponent, {
    type: Type;
}>;

export { ApplicationCommandOptions, type AutocompleteFocusedOption, type FocusableOptionType, type SubcommandOptionType, findModalField, getFocusedOption, isFocusedOption };
