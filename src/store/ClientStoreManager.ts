import type { RootStore } from ".";

class ClientStoreManager {
  private static _instance: ClientStoreManager;
  private _clientStore: RootStore | null = null;

  private constructor() {}

  public static get instance(): ClientStoreManager {
    if (!ClientStoreManager._instance) {
      ClientStoreManager._instance = new ClientStoreManager();
    }
    return ClientStoreManager._instance;
  }

  public setRootStore(store: RootStore): void {
    this._clientStore = store;
  }

  public getRootStore(): RootStore | null {
    return this._clientStore;
  }
}

export const clientStoreManager = ClientStoreManager.instance;
