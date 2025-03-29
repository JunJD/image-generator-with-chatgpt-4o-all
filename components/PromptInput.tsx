import { useState, useRef, useEffect } from "react";
import { ArrowUp, Upload, ChevronDown, X } from "lucide-react";
import { getRandomSuggestions, getSuggestionsByStyle, Suggestion, STYLE_NAMES, STYLE_PROMPTS } from "@/lib/suggestions";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QualityMode = "performance" | "quality";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  showProviders: boolean;
  onToggleProviders: () => void;
  mode: QualityMode;
  onModeChange: (mode: QualityMode) => void;
  suggestions: Suggestion[];
  onImageUpload?: (imageBase64: string | null) => void;
  uploadedImage?: string | null;
}

export function PromptInput({
  suggestions: initSuggestions,
  isLoading,
  onSubmit,
  onImageUpload,
  uploadedImage,
}: PromptInputProps) {
  const [input, setInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_NAMES.MIYAZAKI);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 设置粘贴事件监听
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!e.clipboardData || !onImageUpload) return;
      
      // 检查剪贴板中是否有图片
      if (e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          
          // 如果剪贴板包含图片
          if (item.type.indexOf('image') !== -1) {
            e.preventDefault(); // 阻止默认粘贴行为
            
            try {
              setIsUploading(true);
              const file = item.getAsFile();
              
              if (file) {
                // 将图片转换为base64
                const base64 = await convertFileToBase64(file);
                
                // 调用图片上传函数
                onImageUpload(base64);
                
                // 如果输入框为空，添加默认提示
                if (!input.trim()) {
                  setInput(selectedStyle !== STYLE_NAMES.CUSTOM 
                    ? STYLE_PROMPTS[selectedStyle as keyof typeof STYLE_PROMPTS] 
                    : "请描述如何转换这张图片的风格，保留原始内容但改变视觉表现");
                }
              }
            } catch (error) {
              console.error('粘贴图片处理错误:', error);
              alert('处理粘贴的图片失败');
            } finally {
              setIsUploading(false);
            }
            
            // 找到图片后不再处理其他项
            break;
          }
        }
      }
    };

    // 获取textarea元素并添加粘贴事件监听
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('paste', handlePaste);
    }

    // 组件卸载时移除事件监听
    return () => {
      if (textarea) {
        textarea.removeEventListener('paste', handlePaste);
      }
    };
  }, [onImageUpload, input, selectedStyle]);

  // 当风格改变时
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    
    // 当用户选择风格时自动填入对应的提示词
    if (style !== STYLE_NAMES.CUSTOM) {
      setInput(STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS]);
    }
  };

  // 用户提交当前输入
  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(input);
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // 将文件转换为Base64
      const base64 = await convertFileToBase64(file);
      
      // 调用父组件的上传处理函数
      if (onImageUpload) {
        onImageUpload(base64);
      }
      
      // 如果输入框为空，添加默认提示
      if (!input.trim()) {
        setInput(selectedStyle !== STYLE_NAMES.CUSTOM 
          ? STYLE_PROMPTS[selectedStyle as keyof typeof STYLE_PROMPTS] 
          : "请描述如何转换这张图片的风格，保留原始内容但改变视觉表现");
      }
    } catch (error) {
      console.error('文件上传错误:', error);
      alert('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      // 清空文件输入，以便重新选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // 清除已上传的图片
  const handleClearImage = () => {
    if (onImageUpload) {
      onImageUpload(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 将文件转换为Base64格式
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('文件读取失败'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="w-full mb-8">
      <div className="bg-zinc-50 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* 显示已上传的图片预览 */}
          {uploadedImage && (
            <div className="relative">
              <div className="w-full flex justify-center items-center mb-2">
                <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="上传的图片" 
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-white transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的提示词或选择风格...可直接Ctrl+V粘贴图片"
              rows={3}
              className="text-base bg-transparent border-none p-0 resize-none placeholder:text-zinc-500 text-[#111111] focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* 风格选择下拉菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-between min-w-[110px] px-2 sm:px-3 py-1.5 rounded-lg bg-background text-sm hover:opacity-70 transition-opacity duration-200 border border-zinc-200 whitespace-nowrap">
                  <span className="mr-1 text-xs sm:text-sm">{selectedStyle}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  {Object.values(STYLE_NAMES).map((style) => (
                    <DropdownMenuItem 
                      key={style}
                      onClick={() => handleStyleChange(style)}
                      className={cn(
                        "cursor-pointer",
                        selectedStyle === style && "font-medium bg-zinc-100"
                      )}
                    >
                      {style}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2">
              {/* 上传图片按钮 */}
              <label className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-zinc-200 hover:bg-zinc-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                {isUploading ? (
                  <Spinner className="w-4 h-4 text-zinc-700" />
                ) : (
                  <Upload className="w-4 h-4 text-zinc-700" />
                )}
              </label>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 rounded-full bg-black flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Spinner className="w-3 h-3 text-white" />
                ) : (
                  <ArrowUp className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
