import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User } from "lucide-react";

const Avatar = () => {
  return (
    <HoverCard openDelay={0} closeDelay={50}>
      <HoverCardTrigger className="flex space-x-1">
        <div className="rounded-full p-2 bg-white text-black">
          <User />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-white">
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  );
};

export default Avatar;
