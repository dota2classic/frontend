import { action, makeObservable, observable } from "mobx";
import { ReportModalMeta } from "@/containers/ReportModal/ReportModal";
import { HydratableStore } from "@/store/HydratableStore";

export class ReportStore implements HydratableStore<unknown> {
  @observable
  reportMeta?: ReportModalMeta = undefined;

  constructor() {
    makeObservable(this);
  }

  @action
  public clear = () => {
    this.reportMeta = undefined;
  };

  @action
  public setReportMeta = (r: ReportModalMeta) => {
    this.reportMeta = r;
  };

  hydrate(): void {}
}
