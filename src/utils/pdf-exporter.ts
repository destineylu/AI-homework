import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ProblemSolution } from "@/store/problems-store";

export interface ExportOptions {
  filename?: string;
  includeImages?: boolean;
  quality?: number; // 0-1, for image quality
}

/**
 * 创建一个临时的 DOM 元素用于渲染内容
 */
function createTemporaryElement(content: string): HTMLElement {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.padding = "40px";
  container.style.backgroundColor = "#ffffff";
  container.style.fontFamily = "Arial, sans-serif, 'Microsoft YaHei', '微软雅黑', SimSun, '宋体'";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.6";
  container.style.color = "#000000";
  container.innerHTML = content;
  document.body.appendChild(container);
  return container;
}

/**
 * 导出单个解决方案为 PDF
 * 使用 html2canvas 捕获渲染内容以支持中文和复杂样式
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
    // 构建 HTML 内容
    let htmlContent = `
      <div style="font-family: Arial, sans-serif, 'Microsoft YaHei', '微软雅黑', SimSun, '宋体'; color: #000;">
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">AI 作业解题结果</h1>
    `;

    // 添加图片
    if (includeImages) {
      htmlContent += `
        <div style="margin: 20px 0;">
          <img src="${imageUrl}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" crossorigin="anonymous" />
        </div>
      `;
    }

    // 添加每个问题
    problems.forEach((problem, index) => {
      htmlContent += `
        <div style="margin: 30px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;">
          <h2 style="font-size: 18px; margin-bottom: 15px; color: #2c3e50;">题目 ${index + 1}</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #34495e;">问题：</strong>
            <p style="margin: 5px 0; white-space: pre-wrap;">${problem.problem}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #27ae60;">答案：</strong>
            <p style="margin: 5px 0; white-space: pre-wrap;">${problem.answer}</p>
          </div>
          
          <div>
            <strong style="color: #2980b9;">解析：</strong>
            <p style="margin: 5px 0; white-space: pre-wrap;">${problem.explanation}</p>
          </div>
        </div>
      `;
    });

    htmlContent += `</div>`;

    // 创建临时元素
    const container = createTemporaryElement(htmlContent);

    // 等待图片加载
    const images = container.getElementsByTagName("img");
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
                setTimeout(() => resolve(null), 3000);
              }
            })
        )
      );
    }

    // 使用 html2canvas 捕获内容
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // 移除临时元素
    document.body.removeChild(container);

    // 创建 PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，继续添加
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Failed to export PDF:", error);
    throw new Error("导出 PDF 失败，请重试");
  }
}

/**
 * 导出所有解决方案为单个 PDF
 * 使用 html2canvas 以支持中文
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
    // 构建所有解决方案的 HTML
    let htmlContent = `
      <div style="font-family: Arial, sans-serif, 'Microsoft YaHei', '微软雅黑', SimSun, '宋体'; color: #000;">
        <h1 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">AI 作业解题结果汇总</h1>
    `;

    solutions.forEach((solution, solutionIndex) => {
      htmlContent += `
        <div style="page-break-before: ${solutionIndex > 0 ? 'always' : 'auto'}; margin-bottom: 40px;">
          <h2 style="font-size: 20px; margin: 20px 0; color: #2c3e50;">解决方案 ${solutionIndex + 1}</h2>
      `;

      // 添加图片
      if (includeImages) {
        htmlContent += `
          <div style="margin: 20px 0;">
            <img src="${solution.imageUrl}" style="max-width: 100%; height: auto; border: 1px solid #ddd;" crossorigin="anonymous" />
          </div>
        `;
      }

      // 添加问题
      solution.problems.forEach((problem, index) => {
        htmlContent += `
          <div style="margin: 30px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;">
            <h3 style="font-size: 18px; margin-bottom: 15px; color: #2c3e50;">题目 ${index + 1}</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #34495e;">问题：</strong>
              <p style="margin: 5px 0; white-space: pre-wrap;">${problem.problem}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #27ae60;">答案：</strong>
              <p style="margin: 5px 0; white-space: pre-wrap;">${problem.answer}</p>
            </div>
            
            <div>
              <strong style="color: #2980b9;">解析：</strong>
              <p style="margin: 5px 0; white-space: pre-wrap;">${problem.explanation}</p>
            </div>
          </div>
        `;
      });

      htmlContent += `</div>`;
    });

    htmlContent += `</div>`;

    // 创建临时元素
    const container = createTemporaryElement(htmlContent);

    // 等待所有图片加载
    const images = container.getElementsByTagName("img");
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
                setTimeout(() => resolve(null), 5000);
              }
            })
        )
      );
    }

    // 使用 html2canvas 捕获内容
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // 移除临时元素
    document.body.removeChild(container);

    // 创建 PDF
    const imgData = canvas.toDataURL("image/jpeg", quality);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，继续添加
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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
