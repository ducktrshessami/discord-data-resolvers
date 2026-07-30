import { APIMessageComponent, ComponentType } from "discord-api-types/v10";
import { ComponentResolutionError } from "./error";
import { RequiredOption } from "./util";

interface BaseFindComponentByIDQuery<Type extends APIMessageComponent["type"]> {
    id: number;
    type: Type;
}

export function findComponentById<Type extends APIMessageComponent["type"]>(components: APIMessageComponent[] | undefined, query: BaseFindComponentByIDQuery<Type> & RequiredOption<false>): Extract<APIMessageComponent, { type: Type }> | null;
export function findComponentById<Type extends APIMessageComponent["type"]>(components: APIMessageComponent[] | undefined, query: BaseFindComponentByIDQuery<Type> & Partial<RequiredOption>): Extract<APIMessageComponent, { type: Type }>;
export function findComponentById<Type extends APIMessageComponent["type"]>(components: APIMessageComponent[] | undefined, { required, ...query }: BaseFindComponentByIDQuery<Type> & Partial<RequiredOption>): Extract<APIMessageComponent, { type: Type }> | null {
    for (const component of components ?? []) {
        if (component.id === query.id) {
            if (component.type !== query.type) {
                throw new ComponentResolutionError(`Expected component type ${ComponentType[query.type]}. Received: ${ComponentType[component.type]}`);
            }
            return <Extract<APIMessageComponent, { type: Type }>>component;
        }
        else if ("components" in component) {
            const result = findComponentById(component.components, { ...query, required: false });
            if (result) {
                return result;
            }
        }
    }
    if (required ?? true) {
        throw new ComponentResolutionError(`Unable to find required component with id: ${query.id}`);
    }
    return null;
}
