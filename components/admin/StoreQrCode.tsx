"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import QRCode from "qrcode";

type StoreQrCodeProps = {
  url: string;
  storeName: string;
};

export default function StoreQrCode({
  url,
  storeName,
}: StoreQrCodeProps) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(url, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#222022",
        light: "#ffffff",
      },
    })
      .then((generated) => {
        if (active) {
          setDataUrl(generated);
        }
      })
      .catch((error) => {
        console.error("QR GENERATION ERROR:", error);
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (!dataUrl) {
    return (
      <div className="flex h-[194px] w-[194px] items-center justify-center rounded-2xl bg-[#F8F8F6]">
        <div className="flex flex-col items-center gap-2 text-black/25">
          <QrCode size={28} />
          <span className="text-[10px] font-medium">
            Generating…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-black/10 bg-white p-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt={`QR code for ${storeName}`}
          width={180}
          height={180}
          className="h-[180px] w-[180px]"
        />
      </div>

      <p className="max-w-full break-all text-center text-[10px] font-medium text-black/40">
        {url.replace(/^https?:\/\//, "")}
      </p>

      <p className="text-center text-[9px] leading-4 text-black/30">
        Customers can scan this to open your public store
        catalog instantly.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-[#222022] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-black"
      >
        Open my store
      </a>
    </div>
  );
}