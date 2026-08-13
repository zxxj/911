import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "zhangxinxin-RMS",
  description: "my blog~",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="">{children}</div>;
}
