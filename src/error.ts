class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ApplicationCommandOptionResolutionError extends CustomError { }
export class ModalFieldResolutionError extends CustomError { }
