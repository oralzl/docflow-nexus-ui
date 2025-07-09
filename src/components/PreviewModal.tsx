import { X, ExternalLink, Download, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'doc' | 'wiki' | 'sheet';
  creator: string;
  createTime: string;
  updateTime: string;
  url?: string;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onExport?: (doc: Document) => void;
}

export const PreviewModal = ({ isOpen, onClose, document, onExport }: PreviewModalProps) => {
  if (!document) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wiki': return '📖';
      case 'doc': return '📄';
      case 'sheet': return '📊';
      default: return '📄';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'wiki': return '知识库';
      case 'doc': return '文档';
      case 'sheet': return '表格';
      default: return '文档';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wiki': return 'bg-blue-100 text-blue-800';
      case 'doc': return 'bg-green-100 text-green-800';
      case 'sheet': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format content for display
  const formatContent = (content: string) => {
    // Simple formatting for demonstration
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-3 leading-relaxed">
        {line || '\u00A0'}
      </p>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-subtle">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl">{getTypeIcon(document.type)}</span>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                  {document.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge className={getTypeColor(document.type)}>
                    {getTypeName(document.type)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {document.creator}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {document.updateTime}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(document)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              )}
              
              {document.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  打开原文
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-sm max-w-none">
            {document.content ? (
              <div className="text-foreground leading-relaxed">
                {formatContent(document.content)}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">暂无内容预览</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            创建时间：{document.createTime}
          </div>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};