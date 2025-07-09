import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SearchPage } from "@/components/SearchPage";
import { LibraryPage } from "@/components/LibraryPage";
import { SettingsModal } from "@/components/SettingsModal";
import { PreviewModal } from "@/components/PreviewModal";
import { useToast } from "@/hooks/use-toast";

// Unified data types
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

const Index = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'library'>('search');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localDocuments, setLocalDocuments] = useState<LocalDocument[]>([]);
  const { toast } = useToast();

  // Mock local documents with url field
  useEffect(() => {
    const mockDocs: LocalDocument[] = [
      {
        id: "1",
        title: "项目需求文档 v2.1",
        content: "这是一个详细的项目需求文档，包含了所有的功能规格说明和技术要求。文档涵盖了用户界面设计、后端架构、数据库设计、API接口规范等多个方面的内容。",
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
        content: "完整的API接口文档，包含所有RESTful接口的详细说明、参数定义、返回格式、错误码说明等。提供了完整的请求示例和响应示例。",
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
        content: "包含用户行为数据、访问统计、转化率分析等关键指标的数据表格。数据覆盖最近3个月的用户活动情况。",
        type: "sheet",
        creator: "王五",
        createTime: "2024-01-10",
        updateTime: "2024-01-25",
        size: "856 KB",
        url: "https://example.com/sheet1",
        tags: ["数据", "统计", "用户"]
      }
    ];
    setLocalDocuments(mockDocs);
  }, []);

  // Simulate token validation
  const validateToken = async (tokenValue: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation - just check if token is not empty
    const isValid = tokenValue.trim().length > 10;
    setIsTokenValid(isValid);
    return isValid;
  };

  // Handle token save
  const handleTokenSave = (newToken: string) => {
    setToken(newToken);
    // In a real app, this would be saved to localStorage or secure storage
    localStorage.setItem('feishu_token', newToken);
  };

  // Load token from storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('feishu_token');
    if (savedToken) {
      setToken(savedToken);
      validateToken(savedToken);
    }
  }, []);

  // Handle search
  const handleSearch = async (query: string, searchType: string): Promise<SearchResult[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: "search-1",
        title: `搜索结果：${query} - 技术文档`,
        content: `这是关于"${query}"的技术文档内容。包含详细的技术实现方案、代码示例、最佳实践建议等内容。文档经过技术团队的仔细审核和测试验证。`,
        type: "doc",
        creator: "技术团队",
        createTime: "2024-01-20",
        updateTime: "2024-01-25",
        url: "https://example.com/doc1"
      },
      {
        id: "search-2", 
        title: `${query} - 知识库文章`,
        content: `这是知识库中关于"${query}"的详细介绍文章。内容涵盖了基础概念、应用场景、操作指南等多个方面，适合不同层次的用户阅读学习。`,
        type: "wiki",
        creator: "产品团队",
        createTime: "2024-01-18",
        updateTime: "2024-01-23",
        url: "https://example.com/wiki1"
      }
    ];

    return searchType === 'all' ? mockResults : mockResults.filter(doc => doc.type === searchType);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    toast({
      title: "刷新完成",
      description: "数据已更新到最新状态。",
    });
  };

  // Handle document preview for search results
  const handleSearchPreview = (result: SearchResult) => {
    const doc: Document = {
      ...result,
      url: result.url
    };
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  // Handle document export for preview modal
  const handleExport = (doc: Document | LocalDocument) => {
    toast({
      title: "导出成功",
      description: `文档"${doc.title}"已导出。`,
    });
  };

  // Handle document update
  const handleUpdate = async (docId: string) => {
    toast({
      title: "更新中...",
      description: "正在从飞书同步最新版本。",
    });
    
    // Simulate update API call
    setTimeout(() => {
      toast({
        title: "更新成功",
        description: "文档已更新到最新版本。",
      });
    }, 2000);
  };

  // Handle document deletion
  const handleDelete = (docId: string) => {
    setLocalDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "文档已删除",
      description: "文档已从本地文档库中移除。",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header 
        onRefresh={handleRefresh}
        onSettings={() => setIsSettingsOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          documentCount={localDocuments.length}
          isTokenValid={isTokenValid}
        />

        {/* Main Content */}
        {activeTab === 'search' ? (
          <SearchPage 
            onSearch={handleSearch}
            onPreview={handleSearchPreview}
          />
        ) : (
          <LibraryPage
            documents={localDocuments}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        token={token}
        onTokenSave={handleTokenSave}
        onTokenValidate={validateToken}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDocument}
        onExport={handleExport}
      />
    </div>
  );
};

export default Index;
