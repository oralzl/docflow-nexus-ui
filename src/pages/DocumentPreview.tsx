import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, ExternalLink, Trash2, Calendar, Copy, FileText, Code, Type, MoreHorizontal, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'doc' | 'wiki' | 'sheet';
  creator: string;
  createTime: string;
  updateTime: string;
  url?: string;
  size?: string;
  tags?: string[];
}

const DocumentPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'rich' | 'markdown' | 'plain'>('rich');
  const [showOutline, setShowOutline] = useState(true);

  // Mock data - 在实际应用中这里会从API获取数据
  useEffect(() => {
    const mockDocs: Document[] = [
      {
        id: "1",
        title: "项目需求文档 v2.1",
        content: "这是一个详细的项目需求文档，包含了所有的功能规格说明和技术要求。文档涵盖了用户界面设计、后端架构、数据库设计、API接口规范等多个方面的内容。\n\n## 功能概述\n\n本项目旨在构建一个现代化的文档管理系统，支持多种文档格式的在线预览、编辑和协作功能。\n\n### 核心功能\n\n1. **文档管理**：支持上传、下载、删除、重命名等基础操作\n2. **在线编辑**：提供富文本编辑器，支持实时协作\n3. **版本控制**：记录文档修改历史，支持版本回退\n4. **权限管理**：细粒度的权限控制，确保数据安全\n\n### 技术架构\n\n- 前端：React + TypeScript + Tailwind CSS\n- 后端：Node.js + Express + MongoDB\n- 存储：阿里云OSS\n- 部署：Docker + Kubernetes",
        type: "doc",
        creator: "张三",
        createTime: "2024-01-15",
        updateTime: "2024-01-20",
        size: "2.3 MB",
        url: "https://example.com/doc1",
        tags: ["需求", "设计", "v2.1"]
      },
      {
        id: "2", 
        title: "API接口文档",
        content: "完整的API接口文档，包含所有RESTful接口的详细说明、参数定义、返回格式、错误码说明等。\n\n## 接口概览\n\n### 用户管理模块\n\n#### 用户注册\n- **接口地址**：`POST /api/users/register`\n- **请求参数**：\n  ```json\n  {\n    \"username\": \"string\",\n    \"email\": \"string\",\n    \"password\": \"string\"\n  }\n  ```\n- **返回格式**：\n  ```json\n  {\n    \"code\": 200,\n    \"message\": \"注册成功\",\n    \"data\": {\n      \"userId\": \"string\",\n      \"token\": \"string\"\n    }\n  }\n  ```\n\n#### 用户登录\n- **接口地址**：`POST /api/users/login`\n- **请求参数**：\n  ```json\n  {\n    \"email\": \"string\",\n    \"password\": \"string\"\n  }\n  ```",
        type: "wiki",
        creator: "李四",
        createTime: "2024-01-18",
        updateTime: "2024-01-22",
        size: "1.8 MB",
        url: "https://example.com/wiki1",
        tags: ["API", "接口", "文档"]
      },
      {
        id: "3",
        title: "用户数据统计表",
        content: "包含用户行为数据、访问统计、转化率分析等关键指标的数据表格。\n\n## 数据概览\n\n### 用户活跃度统计\n\n| 时间段 | 日活跃用户 | 周活跃用户 | 月活跃用户 |\n|--------|------------|------------|------------|\n| 1月第1周 | 1,234 | 5,678 | 12,345 |\n| 1月第2周 | 1,456 | 6,123 | 13,567 |\n| 1月第3周 | 1,678 | 6,789 | 14,890 |\n| 1月第4周 | 1,890 | 7,234 | 15,234 |\n\n### 转化率分析\n\n- **注册转化率**：3.2%\n- **付费转化率**：12.5%\n- **留存率（7天）**：68.9%\n- **留存率（30天）**：45.2%\n\n### 用户行为路径\n\n1. 首页访问 → 产品页面 → 注册页面 → 完成注册\n2. 首页访问 → 关于我们 → 联系我们\n3. 产品页面 → 定价页面 → 购买页面",
        type: "sheet",
        creator: "王五",
        createTime: "2024-01-10",
        updateTime: "2024-01-25",
        size: "856 KB",
        url: "https://example.com/sheet1",
        tags: ["数据", "统计", "用户"]
      }
    ];

    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      const foundDoc = mockDocs.find(doc => doc.id === id);
      setDocument(foundDoc || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleUpdate = async () => {
    if (!document) return;
    
    setIsUpdating(true);
    // 模拟更新API请求
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "更新成功",
        description: "文档已更新到最新版本。",
      });
    }, 1000);
  };

  const handleDelete = () => {
    if (!document) return;
    
    toast({
      title: "文档已删除",
      description: `文档"${document.title}"已从本地文档库中移除。`,
    });
    navigate('/');
  };

  const handleOpenOriginal = () => {
    if (document?.url) {
      window.open(document.url, '_blank');
    }
  };

  const handleCopyContent = async () => {
    if (!document) return;
    
    let contentToCopy = '';
    switch (viewMode) {
      case 'rich':
      case 'plain':
        contentToCopy = document.content;
        break;
      case 'markdown':
        contentToCopy = document.content; // 假设原始内容就是markdown格式
        break;
    }
    
    try {
      await navigator.clipboard.writeText(contentToCopy);
      toast({
        title: "复制成功",
        description: "文档内容已复制到剪贴板。",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板，请手动选择复制。",
        variant: "destructive",
      });
    }
  };

  // 解析文档大纲
  const outline = useMemo(() => {
    if (!document || viewMode !== 'rich') return [];
    
    const lines = document.content.split('\n');
    const headings: { id: string; text: string; level: number }[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        headings.push({
          id: `heading-${index}`,
          text: line.slice(3).trim(),
          level: 2
        });
      } else if (line.startsWith('### ')) {
        headings.push({
          id: `heading-${index}`,
          text: line.slice(4).trim(),
          level: 3
        });
      } else if (line.startsWith('#### ')) {
        headings.push({
          id: `heading-${index}`,
          text: line.slice(5).trim(),
          level: 4
        });
      }
    });
    
    return headings;
  }, [document, viewMode]);

  const scrollToHeading = (headingId: string) => {
    const element = globalThis.document?.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">加载文档中...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">文档未找到</h2>
          <p className="text-muted-foreground mb-4">您要查看的文档不存在或已被删除。</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文档库
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(document.type)}</span>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{document.title}</h1>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      更新于 {document.updateTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? '更新中...' : '更新文档'}
              </Button>
              
              {document.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenOriginal}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  打开原文档
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
              >
                <Copy className="w-4 h-4 mr-2" />
                复制内容
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除文档
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Card className="shadow-medium">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">文档内容</h2>
              <div className="flex items-center gap-2">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'rich' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('rich')}
                    className="h-8 px-3"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    富文本
                  </Button>
                  <Button
                    variant={viewMode === 'markdown' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('markdown')}
                    className="h-8 px-3"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    源码
                  </Button>
                  <Button
                    variant={viewMode === 'plain' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('plain')}
                    className="h-8 px-3"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    纯文本
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  创建于 {document.createTime}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 relative">
            {viewMode === 'rich' && (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {document.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} id={`heading-${index}`} className="text-xl font-bold mt-8 mb-4">{paragraph.slice(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index} id={`heading-${index}`} className="text-lg font-semibold mt-6 mb-3">{paragraph.slice(4)}</h3>;
                  } else if (paragraph.startsWith('#### ')) {
                    return <h4 key={index} id={`heading-${index}`} className="text-base font-semibold mt-4 mb-2">{paragraph.slice(5)}</h4>;
                  } else if (paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-4">{paragraph.slice(2)}</li>;
                  } else if (paragraph.startsWith('```')) {
                    return null; // 简单处理，实际应用中可以添加代码高亮
                  } else if (paragraph.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                  }
                })}
              </div>
            )}
            
            {viewMode === 'markdown' && (
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{document.content}</code>
                </pre>
              </div>
            )}
            
            {viewMode === 'plain' && (
              <div className="leading-relaxed">
                {document.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">
                    {line.replace(/^#+\s*/, '').replace(/^\-\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                ))}
              </div>
            )}

            {/* 悬浮大纲目录 */}
            {viewMode === 'rich' && outline.length > 0 && showOutline && (
              <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-64 max-h-96 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg z-40">
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">大纲目录</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOutline(false)}
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {outline.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors ${
                        heading.level === 2 ? 'font-medium' : 
                        heading.level === 3 ? 'ml-3 text-muted-foreground' : 
                        'ml-6 text-muted-foreground text-xs'
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 显示大纲按钮 */}
            {viewMode === 'rich' && outline.length > 0 && !showOutline && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOutline(true)}
                className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40"
              >
                <List className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DocumentPreview;