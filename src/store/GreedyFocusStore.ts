import { action, computed, makeObservable, observable } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";

type Focusable = HTMLInputElement | HTMLTextAreaElement;
export interface FocusOwner {
  priority: number;
  ref: Focusable;
}
export class GreedyFocusStore implements HydratableStore<unknown> {
  @observable
  public focusQueue: FocusOwner[] = [];

  @computed
  public get owner(): FocusOwner | undefined {
    return this.focusQueue.length === 0
      ? undefined
      : this.focusQueue[this.focusQueue.length - 1];
  }

  constructor() {
    makeObservable(this);
  }

  @action public requestOwnership(owner: FocusOwner) {
    if (!this.focusQueue.find((t) => t.ref === owner.ref)) {
      this.focusQueue.push(owner);
      this.focusQueue.sort((a, b) => a.priority - b.priority);
      this.focusCurrent();
    }
  }

  @action public revokeOwnership(owner: FocusOwner) {
    const idx = this.focusQueue.findIndex((t) => t.ref === owner.ref);
    if (idx !== -1) {
      this.focusQueue.splice(idx, 1);
    }
  }

  public focusCurrent = () => {
    if (this.owner) {
      this.owner.ref.focus();
    }
  };

  hydrate(): void {}
}
