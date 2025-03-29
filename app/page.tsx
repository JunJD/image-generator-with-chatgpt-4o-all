import { ImagePlayground } from "@/components/ImagePlayground";
import { getSuggestionsByStyle, STYLE_NAMES } from "@/lib/suggestions";

export const dynamic = "force-dynamic";

export default function Page() {
  // 默认使用宫崎骏风格
  return <ImagePlayground suggestions={getSuggestionsByStyle(STYLE_NAMES.MIYAZAKI)} />;
}
