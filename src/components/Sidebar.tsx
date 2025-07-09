import { Search, FolderOpen, Database, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: 'search' | 'library';
  onTabChange: (tab: 'search' | 'library') => void;
  documentCount: number;
  isTokenValid: boolean;
}

export const Sidebar = ({ activeTab, onTabChange, documentCount, isTokenValid }: SidebarProps) => {
  const menuItems = [
    {
      id: 'search' as const,
      label: '知识库搜索',
      icon: Search,
      description: '搜索飞书知识库'
    },
    {
      id: 'library' as const,
      label: '本地文档库',
      icon: FolderOpen,
      description: '管理本地文档'
    }
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-normal",
                  "hover:bg-sidebar-accent/50 group",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-medium"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-normal",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                )} />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className={cn(
                    "text-xs transition-colors duration-normal",
                    isActive ? "text-sidebar-accent-foreground/70" : "text-sidebar-foreground/50"
                  )}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Status Section */}
      <div className="p-4 border-t border-sidebar-border/50">
        {/* Document Count */}
        <div className="flex items-center gap-3 mb-3 p-3 bg-sidebar-accent/30 rounded-lg">
          <Database className="w-4 h-4 text-sidebar-primary" />
          <div className="flex-1">
            <div className="text-xs text-sidebar-foreground/70">文档数量</div>
            <div className="text-sm font-semibold">{documentCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Token Status */}
        <div className="flex items-center gap-3 p-3 bg-sidebar-accent/30 rounded-lg">
          {isTokenValid ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <div className="flex-1">
            <div className="text-xs text-sidebar-foreground/70">Token状态</div>
            <div className={cn(
              "text-sm font-semibold",
              isTokenValid ? "text-success" : "text-destructive"
            )}>
              {isTokenValid ? "已连接" : "未配置"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};