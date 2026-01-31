import SearchBar from "@/components/common/SearchBar";
import CaseTable from "@/components/case/CaseTable";

export default function SearchPage() {
  return (
    <div className="space-y-4">
      <SearchBar />
      <CaseTable />
    </div>
  );
}
