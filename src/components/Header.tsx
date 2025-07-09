import { RefreshCw, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh: () => void;
  onSettings: () => void;
  isRefreshing?: boolean;
}

export const Header = ({ onRefresh, onSettings, isRefreshing = false }: HeaderProps) => {
  return (
    <header className="h-16 bg-gradient-hero shadow-soft border-b border-border/50 sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">飞书文档管理器</h1>
            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
              v1.0
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            设置
          </Button>
        </div>
      </div>
    </header>
  );
};