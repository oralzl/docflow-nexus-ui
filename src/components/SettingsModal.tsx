import { useState, useEffect } from "react";
import { X, Key, ExternalLink, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onTokenSave: (token: string) => void;
  onTokenValidate: (token: string) => Promise<boolean>;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  token, 
  onTokenSave, 
  onTokenValidate 
}: SettingsModalProps) => {
  const [newToken, setNewToken] = useState(token);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    setNewToken(token);
    setValidationStatus('idle');
  }, [token, isOpen]);

  const handleValidate = async () => {
    if (!newToken.trim()) return;
    
    setIsValidating(true);
    try {
      const isValid = await onTokenValidate(newToken);
      setValidationStatus(isValid ? 'valid' : 'invalid');
      
      if (isValid) {
        toast({
          title: "Token验证成功",
          description: "您的Token配置有效，可以正常使用。",
        });
      } else {
        toast({
          title: "Token验证失败",
          description: "请检查Token是否正确或已过期。",
          variant: "destructive",
        });
      }
    } catch (error) {
      setValidationStatus('invalid');
      toast({
        title: "验证出错",
        description: "验证过程中发生错误，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    onTokenSave(newToken);
    toast({
      title: "设置已保存",
      description: "Token配置已更新。",
    });
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板。",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            飞书API配置
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Configuration */}
          <div className="space-y-3">
            <Label htmlFor="token" className="text-base font-medium">
              用户访问Token (User Access Token)
            </Label>
            <Textarea
              id="token"
              placeholder="请输入您的飞书用户访问Token..."
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            
            {/* Validation Status */}
            {validationStatus === 'valid' && (
              <Alert className="border-success/50 bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Token验证成功，配置有效！
                </AlertDescription>
              </Alert>
            )}
            
            {validationStatus === 'invalid' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Token验证失败，请检查Token是否正确或已过期。
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleValidate}
                disabled={!newToken.trim() || isValidating}
                variant="outline"
                className="flex-1"
              >
                {isValidating ? "验证中..." : "验证Token"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!newToken.trim()}
                className="flex-1"
              >
                保存配置
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">如何获取Token？</h3>
            
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">1. 访问飞书开放平台</h4>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">https://open.feishu.cn/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("https://open.feishu.cn/")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open("https://open.feishu.cn/", "_blank")}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">2. 创建应用</h4>
                <p className="text-muted-foreground">
                  登录后创建一个新的应用，获取App ID和App Secret
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">3. 配置权限</h4>
                <p className="text-muted-foreground">
                  在应用权限管理中开启以下权限：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>docs:read - 读取文档内容</li>
                  <li>wiki:read - 读取知识库</li>
                  <li>drive:read - 读取云空间文件</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">4. 获取Token</h4>
                <p className="text-muted-foreground">
                  使用用户身份验证流程获取用户访问Token，或使用应用凭证获取应用访问Token
                </p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>安全提示：</strong>
                请妥善保管您的Token，不要在公共场所分享。Token具有访问您飞书数据的权限。
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};