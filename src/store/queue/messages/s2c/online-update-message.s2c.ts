export enum ClientType {
  LAUNCHER = "launcher",
  WEBAPP = "webapp",
}

export interface OnlineEntry {
  steamId: string;
  clientType: ClientType;
}

export class OnlineUpdateMessageS2C {
  constructor(
    public readonly online: string[],
    public readonly sessions: number,
    public readonly clients: OnlineEntry[],
  ) {}
}
