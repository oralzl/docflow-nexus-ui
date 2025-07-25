import { useState } from "react";
import { FileText, Trash2, Eye, Calendar, User, RefreshCw, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LocalDocument {
  id: string;
  title: string;
  content: string;
  type: 'doc' | 'wiki' | 'sheet';
  creator: string;
  createTime: string;
  updateTime: string;
  size: string;
  url?: string;
  tags?: string[];
}

interface LibraryPageProps {
  documents: LocalDocument[];
  onDelete: (docId: string) => void;
  onUpdate: (docId: string) => void;
}

export const LibraryPage = ({ documents, onDelete, onUpdate }: LibraryPageProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="flex-1 p-6 bg-gradient-subtle min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">本地文档库</h2>
          <p className="text-muted-foreground">管理和浏览您保存的本地文档</p>
        </div>

        {/* Search and Controls */}
        <Card className="mb-6 shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索本地文档..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  共 {filteredDocuments.length} 个文档
                </span>
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    网格
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    列表
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid/List */}
        {filteredDocuments.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? '没有找到匹配的文档' : '文档库为空'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? '尝试使用不同的关键词搜索' : '开始搜索知识库文档并保存到本地文档库'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className="shadow-soft hover:shadow-medium transition-all duration-normal group cursor-pointer"
                onClick={() => navigate(`/document/${doc.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-normal line-clamp-2">
                          {doc.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-normal">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/document/${doc.id}`);
                        }}
                        className="h-8 w-8 p-0"
                        title="预览文档"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdate(doc.id);
                        }}
                        className="h-8 w-8 p-0"
                        title="更新文档"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      {doc.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(doc.url, '_blank');
                          }}
                          className="h-8 w-8 p-0"
                          title="打开原文档"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(doc.id);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="删除文档"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {doc.content}
                  </p>
                  
                  <div className="flex items-center justify-end text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {doc.updateTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};