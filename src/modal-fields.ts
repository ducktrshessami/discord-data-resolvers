import { APIModalSubmissionComponent, ComponentType, ModalSubmitComponent } from "discord-api-types/v10";
import { ModalFieldResolutionError } from "./error";
import { RequiredOption } from "./util";

export type ModalSubmitFieldType = ModalSubmitComponent["type"];
type ExtractedField<FieldType extends ModalSubmitFieldType> = Extract<ModalSubmitComponent, { type: FieldType }>;
interface BaseGetFieldQuery<FieldType extends ModalSubmitFieldType> {
    type: FieldType;
    customId: string;
}

export class ModalSubmitFields {
    private readonly _fields: Map<string, ModalSubmitComponent>;

    constructor(components: APIModalSubmissionComponent[]) {
        this._fields = new Map<string, ModalSubmitComponent>();
        for (const component of components) {
            switch (component.type) {
                case ComponentType.Label: this._fields.set(component.component.custom_id, component.component); break;
                case ComponentType.ActionRow:
                    for (const rowComponent of component.components) {
                        this._fields.set(rowComponent.custom_id, rowComponent);
                    }
                    break;
            }
        }
    }

    get<FieldType extends ModalSubmitFieldType>(query: BaseGetFieldQuery<FieldType> & RequiredOption<true>): ExtractedField<FieldType>;
    get<FieldType extends ModalSubmitFieldType>(query: BaseGetFieldQuery<FieldType> & Partial<RequiredOption>): ExtractedField<FieldType> | null;
    get<FieldType extends ModalSubmitFieldType>(query: BaseGetFieldQuery<FieldType> & Partial<RequiredOption>): ExtractedField<FieldType> | null {
        const field = this._fields.get(query.customId) ?? null;
        if (query.required && !field) {
            throw new ModalFieldResolutionError(`Unable to find required field: ${query.customId}`);
        }
        if (field && field.type !== query.type) {
            throw new ModalFieldResolutionError(`Expected field type ${ComponentType[query.type]}. Received: ${ComponentType[field.type]}`);
        }
        return <ExtractedField<FieldType> | null>field;
    }
}
