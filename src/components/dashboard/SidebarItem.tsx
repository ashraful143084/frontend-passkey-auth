import React from "react";
import { MessageSquare, Trash2, MoreHorizontal } from "lucide-react";

export interface SidebarItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  active,
  onClick,
  onDelete,
}) => (
  <div className="group relative">
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_-5px_var(--color-teal-500/30)]"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <MessageSquare
        className={`w-4 h-4 flex-shrink-0 ${active ? "text-teal-400" : "text-gray-500"}`}
      />
      <span className="truncate pr-8">{label}</span>
    </button>
    {active && (
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
    {!active && (
      <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all">
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
