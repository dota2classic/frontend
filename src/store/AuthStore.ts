import { action, makeObservable, observable } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";

export class AuthStore implements HydratableStore<{ token?: string }> {
  public token: string | undefined = undefined;

  constructor() {
    makeObservable(this, {
      token: observable,
      setToken: action,
    });
  }

  // if data is provided set this data to BooksStore
  hydrate = (data) => {
    if (!data) return;
    this.setToken(data.token);
  };

  public setToken(token: string | undefined) {
    this.token = token;
  }
}
