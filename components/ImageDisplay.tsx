import { useState, useEffect } from "react";
import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Download, ImageIcon, AlertCircle, Share } from "lucide-react";
import { Stopwatch } from "./Stopwatch";
import { cn } from "@/lib/utils";
import { imageHelpers } from "@/lib/image-helpers";
import { ProviderTiming } from "@/lib/image-types";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface ImageDisplayProps {
  provider: string;
  markdown: string | null | undefined;
  timing?: ProviderTiming;
  failed?: boolean;
  fallbackIcon?: React.ReactNode;
  enabled?: boolean;
  modelId: string;
}

export function ImageDisplay({
  provider,
  markdown,
  timing,
  failed,
  fallbackIcon,
  modelId,
}: ImageDisplayProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (isZoomed) {
      window.history.pushState({ zoomed: true }, "");
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    const handlePopState = () => {
      if (isZoomed) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isZoomed]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (markdown) {
      e.stopPropagation();
      setIsZoomed(true);
    }
  };

  const handleActionClick = (
    e: React.MouseEvent,
    imageData: string,
    provider: string,
  ) => {
    e.stopPropagation();
    imageHelpers.shareOrDownload(imageData, provider).catch((error) => {
      console.error("Failed to share/download image:", error);
    });
  };

  return (
    <>
      <div
        className={cn(
          "relative w-full aspect-square group bg-zinc-50 rounded-lg overflow-auto",
          markdown && !failed && "cursor-pointer",
          (!markdown || failed) && "border-1 border-zinc-100",
        )}
        onClick={handleImageClick}
      >
        {(markdown || failed) && (
          <div className="absolute top-2 left-2 max-w-[75%] bg-white/95 px-2 py-1 flex items-center gap-2 rounded-lg z-10">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Label className="text-xs text-gray-900 truncate min-w-0 grow">
                    {imageHelpers.formatModelId(modelId)}
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{modelId}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {markdown && !failed ? (
          <>
            <div className="w-full h-full flex items-center justify-center">
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
                allowedElements={["img", "p", "a", "div"]}
                components={{
                  img: function Image(props) {
                    return <img {...props} className="max-w-full h-auto object-contain rounded-lg" alt={props.alt || "生成的图片"} />;
                  },
                  p: function Paragraph({ children }) {
                    return <>{children}</>;
                  },
                  a: function Anchor({ children }) {
                    return <>{children}</>;
                  },
                  div: function Div({ children }) {
                    return <>{children}</>;
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>

            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 left-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => handleActionClick(e, markdown, provider)}
            >
              <span className="sm:hidden">
                <Share className="h-4 w-4" />
              </span>
              <span className="hidden sm:block">
                <Download className="h-4 w-4" />
              </span>
            </Button>
            {timing?.elapsed && (
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 shadow z-10">
                <span className="text-xs text-white/90 font-medium">
                  {(timing.elapsed / 1000).toFixed(1)}s
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {failed ? (
              fallbackIcon || <AlertCircle className="h-8 w-8 text-red-500" />
            ) : markdown ? (
              <>
                <div className="w-full h-full flex items-center justify-center">
                  <ReactMarkdown 
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    remarkPlugins={[remarkGfm]}
                    allowedElements={["img", "p", "a", "div"]}
                    components={{
                      img: function Image(props) {
                        return <img {...props} className="max-w-full h-auto object-contain rounded-lg" alt={props.alt || "生成的图片"} />;
                      },
                      p: function Paragraph({ children }) {
                        return <>{children}</>;
                      },
                      a: function Anchor({ children }) {
                        return <>{children}</>;
                      },
                      div: function Div({ children }) {
                        return <>{children}</>;
                      }
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 left-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => handleActionClick(e, markdown, provider)}
                >
                  <span className="sm:hidden">
                    <Share className="h-4 w-4" />
                  </span>
                  <span className="hidden sm:block">
                    <Download className="h-4 w-4" />
                  </span>
                </Button>
              </>
            ) : timing?.startTime ? (
              <>
                <Stopwatch startTime={timing.startTime} />
              </>
            ) : (
              <ImageIcon className="h-12 w-12 text-zinc-300" />
            )}
          </div>
        )}
      </div>

      {isZoomed &&
        markdown &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer min-h-[100dvh] w-screen"
            onClick={() => setIsZoomed(false)}
          >
            <div 
              className="bg-white dark:bg-zinc-900 rounded-lg max-h-[90dvh] max-w-[90vw] overflow-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
                allowedElements={["img", "p", "a", "div"]}
                components={{
                  img: function Image(props) {
                    return <img {...props} className="max-w-full h-auto object-contain rounded-lg" alt={props.alt || "生成的图片"} />;
                  },
                  p: function Paragraph({ children }) {
                    return <>{children}</>;
                  },
                  a: function Anchor({ children }) {
                    return <>{children}</>;
                  },
                  div: function Div({ children }) {
                    return <>{children}</>;
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
