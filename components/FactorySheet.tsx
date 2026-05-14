import Image from "next/image";
import type { ProductionSheet, ProductType } from "@/lib/types";
import { productTypeLabel } from "@/lib/mockData";

type FactorySheetProps = {
  sheet: ProductionSheet;
};

const FIELDS: Array<{ key: keyof ProductionSheet; label: string }> = [
  { key: "production_sheet_id", label: "生产单编号" },
  { key: "order_id",            label: "订单编号" },
  { key: "totem_name",          label: "图腾名称" },
  { key: "product_type",        label: "商品类型" },
  { key: "product_name",        label: "商品名称" },
  { key: "design_file",         label: "设计文件" },
  { key: "size",                label: "尺寸" },
  { key: "material",            label: "材质" },
  { key: "craft",               label: "工艺" },
  { key: "package",             label: "包装方式" },
  { key: "production_time",     label: "生产时间" },
];

export function FactorySheet({ sheet }: FactorySheetProps) {
  const productionReady = sheet.quality_check?.checks.production_ready ?? true;

  function renderVal(key: keyof ProductionSheet) {
    const val = sheet[key];
    if (!val) return "—";
    if (key === "product_type") return productTypeLabel(val as ProductType);
    return String(val);
  }

  return (
    <div className="panel factory-sheet">
      <div className="factory-sheet-head">
        <div>
          <div className="label">生产规范</div>
          <h2>工厂生产单</h2>
        </div>
        <span className="badge">{sheet.production_sheet_id}</span>
      </div>

      <div className="factory-preview-row">
        <div className="factory-design-preview">
          <Image
            src={sheet.design_file}
            alt={`${sheet.totem_name ?? "图腾"}设计文件`}
            width={180}
            height={180}
            unoptimized
          />
        </div>
        <div className="factory-status-row">
          <span className="factory-status-dot" />
          {productionReady ? "生产单已就绪 · 可交厂商执行" : "生产单已生成 · 图像需复核后交厂"}
        </div>
      </div>

      <div className="factory-fields">
        {FIELDS.map(({ key, label }) => (
          <div className="factory-field" key={key}>
            <span className="factory-key">{label}</span>
            <span className="factory-val">{renderVal(key)}</span>
          </div>
        ))}
      </div>

      {sheet.factory_note && (
        <div className="factory-note-wrap">
          <div className="label" style={{ marginBottom: 8 }}>工厂备注</div>
          <div className="factory-note">{sheet.factory_note}</div>
        </div>
      )}

      {sheet.print_file_spec ? (
        <div className="factory-note-wrap">
          <div className="label" style={{ marginBottom: 8 }}>印刷文件规格</div>
          <div className="factory-spec-grid">
            <div><span>文件格式</span><strong>{sheet.print_file_spec.format}</strong></div>
            <div><span>分辨率</span><strong>{sheet.print_file_spec.resolution}</strong></div>
            <div><span>色彩模式</span><strong>{sheet.print_file_spec.color_mode}</strong></div>
            <div><span>印刷区域</span><strong>{sheet.print_file_spec.print_area}</strong></div>
            <div><span>安全边距</span><strong>{sheet.print_file_spec.safe_margin}</strong></div>
            <div><span>出血线</span><strong>{sheet.print_file_spec.bleed}</strong></div>
          </div>
        </div>
      ) : null}

      {sheet.quality_check ? (
        <div className="factory-note-wrap">
          <div className="label" style={{ marginBottom: 8 }}>图像质检</div>
          <div className={`factory-qc factory-qc-${sheet.quality_check.status}`}>
            <strong>{sheet.quality_check.label}</strong>
            <span>生产可用：{sheet.quality_check.checks.production_ready ? "是" : "需复核"}</span>
            <ul>
              {sheet.quality_check.notes.slice(0, 3).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="factory-proof">
        <strong>AI 图腾</strong> 已转化为可执行的商品生产信息。
      </div>
    </div>
  );
}
