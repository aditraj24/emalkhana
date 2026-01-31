"use client";

type Props = {
  qrCode: string;
};

export default function QRPreview({ qrCode }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow text-center">
      <p className="text-sm text-[#334155] font-medium mb-2">
        Property QR Code
      </p>

      <img
        src={qrCode}
        alt="Property QR"
        className="mx-auto w-40 h-40 object-contain"
      />

      <p className="text-xs text-[#94A3B8] mt-2">
        Scan to verify property
      </p>
    </div>
  );
}
