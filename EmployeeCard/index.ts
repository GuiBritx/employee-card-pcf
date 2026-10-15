import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class EmployeeCard implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private card?: HTMLElement;
    private pointerMoveHandler?: (event: PointerEvent) => void;
    private pointerLeaveHandler?: () => void;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        _context: ComponentFramework.Context<IInputs>,
        _notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        container.classList.add("employee-card-control");

        const card = document.createElement("article");
        card.className = "employee-card";
        card.setAttribute("aria-label", "Employee profile: Guilherme Pinheiro");

        const glow = document.createElement("span");
        glow.className = "employee-card__glow";
        glow.setAttribute("aria-hidden", "true");

        const eyebrow = document.createElement("p");
        eyebrow.className = "employee-card__eyebrow";
        eyebrow.textContent = "Kyndryl / Creative technology";

        const name = document.createElement("h1");
        name.className = "employee-card__name";
        name.setAttribute("data-text", "Guilherme");
        name.textContent = "Guilherme";

        const surname = document.createElement("span");
        surname.className = "employee-card__surname";
        surname.textContent = "Pinheiro";
        name.appendChild(surname);

        const role = document.createElement("p");
        role.className = "employee-card__role";
        role.textContent = "UX/UI Designer";

        const footer = document.createElement("div");
        footer.className = "employee-card__footer";

        const mark = document.createElement("span");
        mark.className = "employee-card__mark";
        mark.textContent = "GP";

        const detail = document.createElement("span");
        detail.className = "employee-card__detail";
        detail.textContent = "Designing what comes next";

        footer.append(mark, detail);
        card.append(glow, eyebrow, name, role, footer);
        container.appendChild(card);
        this.card = card;

        this.pointerMoveHandler = (event: PointerEvent): void => {
            if (!this.card) {
                return;
            }

            const bounds = this.card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            const rotateY = (x - 0.5) * 10;
            const rotateX = (0.5 - y) * 10;

            this.card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
            this.card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
            this.card.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
            this.card.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
        };

        this.pointerLeaveHandler = (): void => {
            if (!this.card) {
                return;
            }

            this.card.style.setProperty("--rotate-x", "0deg");
            this.card.style.setProperty("--rotate-y", "0deg");
            this.card.style.setProperty("--pointer-x", "50%");
            this.card.style.setProperty("--pointer-y", "50%");
        };

        card.addEventListener("pointermove", this.pointerMoveHandler);
        card.addEventListener("pointerleave", this.pointerLeaveHandler);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(_context: ComponentFramework.Context<IInputs>): void {
        // The profile content is intentionally presentation-only.
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        if (this.card && this.pointerMoveHandler && this.pointerLeaveHandler) {
            this.card.removeEventListener("pointermove", this.pointerMoveHandler);
            this.card.removeEventListener("pointerleave", this.pointerLeaveHandler);
        }

        this.card = undefined;
        this.pointerMoveHandler = undefined;
        this.pointerLeaveHandler = undefined;
    }
}
