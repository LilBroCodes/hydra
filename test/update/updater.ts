export abstract class TestUpdate {
    abstract runUpdate(): void;

    update(): void {
        this.runUpdate();
        console.log(`Updated baseline for test '${this.constructor.name}'.`);
    }
}