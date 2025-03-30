import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bell } from "lucide-react";

const Notification = () => {
  return (
    <HoverCard openDelay={0} closeDelay={50}>
      <HoverCardTrigger className="flex space-x-1">
        <Bell /> <span>Thông báo</span>
      </HoverCardTrigger>
      <HoverCardContent className="bg-white">
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  );
};

export default Notification;
