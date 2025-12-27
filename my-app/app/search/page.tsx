import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { SearchContent } from "./search-content"

export const dynamic = "force-dynamic"

export default function SearchPage() {
  return (
    <Suspense fallback={<Card className="p-6">Loading search...</Card>}>
      <SearchContent />
    </Suspense>
  )
}
