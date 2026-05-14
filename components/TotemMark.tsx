type TotemMarkProps = {
  variant?: "cloud" | "moon" | "mushroom" | "turtle";
};

export function TotemMark({ variant = "cloud" }: TotemMarkProps) {
  if (variant === "moon") {
    return (
      <div className="cloud" style={{ borderRadius: "50%", width: 190, height: 190 }}>
        <div className="cloud-face">
          <span className="eye" />
          <span className="eye" />
        </div>
        <div className="smile" />
      </div>
    );
  }

  if (variant === "mushroom") {
    return (
      <div className="cloud" style={{ borderRadius: "90px 90px 36px 36px", width: 210, height: 150 }}>
        <div className="cloud-face">
          <span className="eye" />
          <span className="eye" />
        </div>
        <div className="smile" />
      </div>
    );
  }

  if (variant === "turtle") {
    return (
      <div className="cloud" style={{ borderRadius: "90px 110px 80px 100px", width: 220, height: 138 }}>
        <div className="cloud-face">
          <span className="eye" />
          <span className="eye" />
        </div>
        <div className="smile" />
      </div>
    );
  }

  return (
    <div className="cloud">
      <div className="cloud-face">
        <span className="eye" />
        <span className="eye" />
      </div>
      <div className="smile" />
    </div>
  );
}

export function variantFromName(name: string): "cloud" | "moon" | "mushroom" | "turtle" {
  if (name.includes("月亮")) return "moon";
  if (name.includes("蘑菇")) return "mushroom";
  if (name.includes("龟")) return "turtle";
  return "cloud";
}

