import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ProblemSolution } from "@/store/problems-store";

export interface ExportOptions {
  filename?: string;
  includeImages?: boolean;
  quality?: number; // 0-1, for image quality
}

/**
 * 导出单个解决方案为 PDF
 * @param imageUrl 图片URL
 * @param problems 问题解答列表
 * @param options 导出选项
 */
export async function exportSolutionAsPDF(
  imageUrl: string,
  problems: ProblemSolution[],
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `solution-${Date.now()}.pdf`,
    includeImages = true,
    quality = 0.8,
  } = options;

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // 添加标题
    pdf.setFontSize(16);
    pdf.text("AI 作业解题结果", margin, yPosition);
    yPosition += 10;

    // 添加图片（如果启用）
    if (includeImages) {
      try {
        // 尝试加载图片并添加到 PDF
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          setTimeout(reject, 5000); // 5秒超时
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        // 计算缩放比例以适应页面宽度
        const maxWidth = contentWidth * 3.78; // mm to px (approximately)
        const scale = Math.min(1, maxWidth / img.width);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgData = canvas.toDataURL("image/jpeg", quality);
        const imgHeight = (canvas.height * contentWidth) / canvas.width;
        
        // 检查是否需要新页面
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.addImage(imgData, "JPEG", margin, yPosition, contentWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.warn("Failed to add image to PDF:", error);
        // 继续处理，即使图片加载失败
      }
    }

    // 添加每个问题的解答
    pdf.setFontSize(12);
    
    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      
      // 检查是否需要新页面
      if (yPosition > pageHeight - margin - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // 问题标题
      pdf.setFont("helvetica", "bold");
      pdf.text(`题目 ${i + 1}:`, margin, yPosition);
      yPosition += 7;
      
      // 问题内容
      pdf.setFont("helvetica", "normal");
      const problemLines = pdf.splitTextToSize(problem.problem, contentWidth);
      pdf.text(problemLines, margin, yPosition);
      yPosition += problemLines.length * 5 + 5;
      
      // 答案
      pdf.setFont("helvetica", "bold");
      pdf.text("答案:", margin, yPosition);
      yPosition += 7;
      
      pdf.setFont("helvetica", "normal");
      const answerLines = pdf.splitTextToSize(problem.answer, contentWidth);
      pdf.text(answerLines, margin, yPosition);
      yPosition += answerLines.length * 5 + 5;
      
      // 解析
      pdf.setFont("helvetica", "bold");
      pdf.text("解析:", margin, yPosition);
      yPosition += 7;
      
      pdf.setFont("helvetica", "normal");
      const explanationLines = pdf.splitTextToSize(
        problem.explanation,
        contentWidth
      );
      pdf.text(explanationLines, margin, yPosition);
      yPosition += explanationLines.length * 5 + 10;
      
      // 添加分隔线
      if (i < problems.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }
    }

    // 保存 PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Failed to export PDF:", error);
    throw new Error("导出 PDF 失败，请重试");
  }
}

/**
 * 导出所有解决方案为单个 PDF
 * @param solutions 所有解决方案
 * @param options 导出选项
 */
export async function exportAllSolutionsAsPDF(
  solutions: Array<{ imageUrl: string; problems: ProblemSolution[] }>,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `all-solutions-${Date.now()}.pdf`,
    includeImages = true,
    quality = 0.8,
  } = options;

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;
    let isFirstPage = true;

    for (let solutionIndex = 0; solutionIndex < solutions.length; solutionIndex++) {
      const solution = solutions[solutionIndex];
      
      // 如果不是第一个解决方案，添加新页面
      if (!isFirstPage) {
        pdf.addPage();
        yPosition = margin;
      }
      isFirstPage = false;

      // 添加解决方案标题
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`解决方案 ${solutionIndex + 1}`, margin, yPosition);
      yPosition += 10;

      // 添加图片
      if (includeImages) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = solution.imageUrl;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(reject, 5000);
          });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          
          const maxWidth = contentWidth * 3.78;
          const scale = Math.min(1, maxWidth / img.width);
          
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const imgData = canvas.toDataURL("image/jpeg", quality);
          const imgHeight = (canvas.height * contentWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.addImage(imgData, "JPEG", margin, yPosition, contentWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.warn("Failed to add image:", error);
        }
      }

      // 添加问题
      pdf.setFontSize(12);
      
      for (let i = 0; i < solution.problems.length; i++) {
        const problem = solution.problems[i];
        
        if (yPosition > pageHeight - margin - 40) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setFont("helvetica", "bold");
        pdf.text(`题目 ${i + 1}:`, margin, yPosition);
        yPosition += 7;
        
        pdf.setFont("helvetica", "normal");
        const problemLines = pdf.splitTextToSize(problem.problem, contentWidth);
        pdf.text(problemLines, margin, yPosition);
        yPosition += problemLines.length * 5 + 5;
        
        pdf.setFont("helvetica", "bold");
        pdf.text("答案:", margin, yPosition);
        yPosition += 7;
        
        pdf.setFont("helvetica", "normal");
        const answerLines = pdf.splitTextToSize(problem.answer, contentWidth);
        pdf.text(answerLines, margin, yPosition);
        yPosition += answerLines.length * 5 + 5;
        
        pdf.setFont("helvetica", "bold");
        pdf.text("解析:", margin, yPosition);
        yPosition += 7;
        
        pdf.setFont("helvetica", "normal");
        const explanationLines = pdf.splitTextToSize(
          problem.explanation,
          contentWidth
        );
        pdf.text(explanationLines, margin, yPosition);
        yPosition += explanationLines.length * 5 + 10;
        
        if (i < solution.problems.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }
      }
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Failed to export all solutions as PDF:", error);
    throw new Error("导出 PDF 失败，请重试");
  }
}

/**
 * 使用 html2canvas 捕获 DOM 元素并导出为 PDF
 * 适用于需要保留完整样式和 LaTeX 渲染的场景
 * @param element 要导出的 DOM 元素
 * @param filename 文件名
 */
export async function exportElementAsPDF(
  element: HTMLElement,
  filename = `export-${Date.now()}.pdf`
): Promise<void> {
  try {
    // 使用 html2canvas 捕获元素
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // 创建 PDF
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // 计算图片尺寸以适应页面
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，继续添加
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Failed to export element as PDF:", error);
    throw new Error("导出 PDF 失败，请重试");
  }
}
