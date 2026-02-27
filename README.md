# discord-data-resolvers
Standalone type-safe interaction data parsing utilities

## Usage

```js
import { ApplicationCommandOptionType, ComponentType } from "discord-api-types/v10";
import { ApplicationCommandOptions, ModalSubmitFields } from "discord-data-resolvers";

// interaction: APIChatInputApplicationCommandInteraction
const options = new ApplicationCommandOptions(interaction.data.options);
const subcommandGroup = options.group; // string | null
const subcommand = options.subcommand; // string | null
const foo = options.get({
    type: ApplicationCommandOptionType.String,
    name: "foo"
}); // APIApplicationCommandInteractionDataStringOption | null
const bar = options.get({
    type: ApplicationCommandOptionType.Integer,
    name: "bar",
    required: true
}); // APIApplicationCommandInteractionDataIntegerOption

// interaction: APIModalSubmitInteraction
const fields = new ModalSubmitFields(interaction.data.components);
const foo = fields.get({
    type: ComponentType.TextInput,
    customId: "foo"
}); // APIModalSubmitTextInputComponent
const bar = fields.get({
    type: ComponentType.StringSelect,
    customId: "bar",
    required: false
}); // APIModalSubmitStringSelectComponent | null
```
