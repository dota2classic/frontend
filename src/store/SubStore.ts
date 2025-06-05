import { action, makeObservable, observable } from "mobx";

export class SubStore {
  @observable
  subscriptionVisible: boolean = true;

  constructor() {
    makeObservable(this);
  }

  @action
  show = () => {
    this.subscriptionVisible = true;
  };

  @action
  hide = () => {
    this.subscriptionVisible = false;
  };
}
