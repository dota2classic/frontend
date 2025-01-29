import { NotificationDto } from "@/api/back";

export class NotificationCreatedMessageS2C {
  constructor(public readonly notificationDto: NotificationDto) {}
}
