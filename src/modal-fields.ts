import { APIModalSubmissionComponent, ComponentType, ModalSubmitComponent } from "discord-api-types/v10";
import { ModalFieldResolutionError } from "./error";

interface FindModalFieldQuery<Type extends ModalSubmitComponent["type"]> {
    type: Type;
    customId: string;
}

export function findModalField<Type extends ModalSubmitComponent["type"]>(components: APIModalSubmissionComponent[], options: FindModalFieldQuery<Type>): Extract<ModalSubmitComponent, { type: Type }> {
    for (const field of components) {
        let component: ModalSubmitComponent | null = null;
        switch (field.type) {
            case ComponentType.ActionRow: component = field.components.find(component => component.custom_id === options.customId) ?? null; break;
            case ComponentType.Label: component = field.component; break;
        }
        if (component) {
            if (component.type !== ComponentType.TextInput) {
                throw new ModalFieldResolutionError(`Modal field is not of type ${options.type}: ${options.customId}`);
            }
            return component as Extract<ModalSubmitComponent, { type: Type }>;
        }
    }
    throw new ModalFieldResolutionError(`Unable to find modal field: ${options.customId}`);
}
