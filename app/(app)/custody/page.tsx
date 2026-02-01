import CustodyForm from "@/components/custody/CustodyForm";
import CustodyTimeline from "@/components/custody/CustodyTimeline";

export default function CustodyPage() {
  return (
    <div className="space-y-6">
      <CustodyForm />
      <CustodyTimeline />
    </div>
  );
}
