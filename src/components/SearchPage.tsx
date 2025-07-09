import { useState } from "react";
import { Search, Loader2, ExternalLink, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'wiki' | 'doc' | 'sheet';
  creator: string;
  createTime: string;
  updateTime: string;
}

interface SearchPageProps {
  onSearch: (query: string, type: string) => Promise<SearchResult[]>;
  onPreview: (result: SearchResult) => void;
}

export const SearchPage = ({ onSearch, onPreview }: SearchPageProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const searchResults = await onSearch(query, "wiki");
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  return (
    <div className="flex-1 p-6 bg-gradient-subtle min-h-full">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">知识库文档搜索</h2>
          <p className="text-muted-foreground">搜索您的飞书知识库文档</p>
        </div>

        {/* Search Controls */}
        <Card className="mb-6 shadow-medium">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="输入关键词搜索知识库文档..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-base"
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="h-12 px-8"
                size="lg"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                搜索知识库
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                  <p className="text-muted-foreground">正在搜索文档...</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="py-12">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">没有找到相关文档</h3>
                    <p className="text-muted-foreground">尝试使用不同的关键词或检查搜索条件</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">找到</span>
                  <Badge variant="secondary" className="font-medium">
                    {results.length} 个结果
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {results.map((result) => (
                    <Card key={result.id} className="shadow-soft hover:shadow-medium transition-shadow duration-normal group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-2xl">{getTypeIcon(result.type)}</span>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-normal line-clamp-2">
                                {result.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {result.creator}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {result.updateTime}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeName(result.type)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPreview(result)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-normal"
                            >
                              预览
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(result.url, '_blank')}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-normal"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {result.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <Card className="shadow-soft">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">开始搜索知识库</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  输入关键词搜索您的飞书知识库文档。支持全文搜索，帮您快速找到所需内容。
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};