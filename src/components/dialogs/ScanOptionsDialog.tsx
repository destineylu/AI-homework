import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

interface ScanOptionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (requirements?: string) => void;
  itemsCount: number;
}

const QUICK_OPTIONS = [
  { id: "chinese", label: "用中文解答", value: "请用中文解答所有题目" },
  { id: "english", label: "用英语解答", value: "请用英语解答所有题目" },
  { id: "detailed", label: "详细解答", value: "请提供非常详细的解答过程，每一步都要说明" },
  { id: "concise", label: "简洁模式", value: "只需要最终答案，不需要详细步骤" },
  { id: "with-diagram", label: "包含图解", value: "请用文字描述方式画图辅助说明" },
  { id: "verify", label: "验证答案", value: "必须验证答案的正确性" },
];

export default function ScanOptionsDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  itemsCount,
}: ScanOptionsDialogProps) {
  const { t } = useTranslation("commons");
  const [requirements, setRequirements] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleQuickOption = (option: typeof QUICK_OPTIONS[0]) => {
    if (selectedOptions.includes(option.id)) {
      // 取消选择
      setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
      // 从文本中移除
      setRequirements(
        requirements
          .split("\n")
          .filter((line) => !line.includes(option.value))
          .join("\n"),
      );
    } else {
      // 添加选择
      setSelectedOptions([...selectedOptions, option.id]);
      // 添加到文本
      const newText = requirements
        ? `${requirements}\n${option.value}`
        : option.value;
      setRequirements(newText);
    }
  };

  const handleConfirm = () => {
    onConfirm(requirements.trim() || undefined);
    // 重置状态
    setRequirements("");
    setSelectedOptions([]);
  };

  const handleSkip = () => {
    onConfirm(undefined);
    // 重置状态
    setRequirements("");
    setSelectedOptions([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            解题要求（可选）
          </DialogTitle>
          <DialogDescription>
            为这 {itemsCount} 个题目添加特殊要求，或直接开始解题
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 快捷选项 */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              快捷选项：
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_OPTIONS.map((option) => (
                <Badge
                  key={option.id}
                  variant={
                    selectedOptions.includes(option.id) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleQuickOption(option)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* 自定义输入 */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              自定义要求：
            </label>
            <Textarea
              placeholder="例如：英语题用中文解答，数学题必须画图说明..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              💡 提示：这些要求会添加到全局提示词之后，仅对本次解题生效
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleSkip}>
            跳过，直接开始
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
            确认并开始解题
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
