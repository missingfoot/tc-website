/** Single-task pages (the enquiry forms): no site nav or footer, just the page with its own Back button. */
export default function FocusLayout({ children }: LayoutProps<"/">) {
  return <main className="flex-1">{children}</main>;
}
