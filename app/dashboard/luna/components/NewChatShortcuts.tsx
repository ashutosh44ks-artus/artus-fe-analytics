import { useUserStore } from "@/lib/store/userStore";
import { MdOutlineCode, MdOutlineInsights, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { LunaChatStartShortcuts } from "./utils";

const ShortcutItem = ({
  label,
  description,
  icon: Icon,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="bg-gray-900 border rounded-lg p-4 flex sm:flex-row flex-col justify-between items-center gap-4">
      <div className="flex flex-row gap-4">
        <div className="bg-primary-500/15 text-primary border border-primary/25 rounded-lg shrink-0 grid place-items-center size-8">
          <Icon />
        </div>
        <div>
          <h3 className="font-medium text-sm">{label}</h3>
          <p className="text-xs opacity-75">{description}</p>
        </div>
      </div>
      <div className="shrink-0">
        <MdOutlineKeyboardArrowRight />
      </div>
    </div>
  );
};

const NewChatShortcuts = () => {
  const userName = useUserStore((state) => state.userName);
  const isProductTeam = useUserStore((state) => state.isUserFromProductTeam());
  const isMarketingTeam = useUserStore((state) =>
    state.isUserFromMarketingTeam(),
  );
  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        Hey {userName ? userName : "there"}!{" "}
        <span className="greeting-emoji">👋</span>
      </h2>
      <div>
        <p className="text-xs opacity-75 uppercase font-medium flex items-center gap-2 mb-2">
          <MdOutlineCode /> Things I Can Help With
        </p>

        <div className="flex flex-col gap-4">
          {LunaChatStartShortcuts.filter((shortcut) => {
            if (isProductTeam) {
              return shortcut.type === "product";
            }
            if (isMarketingTeam) {
              return shortcut.type === "marketing";
            }
            return false;
          }).map((shortcut) => (
            <ShortcutItem
              key={shortcut.title}
              label={shortcut.title}
              description={shortcut.desc}
              icon={MdOutlineInsights}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewChatShortcuts;
