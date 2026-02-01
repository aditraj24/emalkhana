import CaseDetails from "@/components/case/CaseDetails";
import PrintButton from "@/components/common/PrintButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseDetailsPage({ params }: PageProps) {
  const { id } = await params; 

  return (
    <div id="print-area">
      <PrintButton caseId={id} />
      <CaseDetails caseId={id} />
    </div>
  );
}
