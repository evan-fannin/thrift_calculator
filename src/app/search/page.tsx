"use client";

// filter by
// size
// brand
// color
// department -> clothing type -> subtype
import { useState } from "react";
import SummaryModal from "./poshmark/SummaryModal";
import TabContainer from "./TabContainer";
import PoshmarkTab from "./poshmark/PoshmarkTab";
import EbayTab from "./ebay/EbayTab";

export default function SearchResults() {
  const tabs = [
    { id: "poshmark", label: "Poshmark" },
    { id: "ebay", label: "Ebay" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <TabContainer
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {activeTab === "poshmark" && <PoshmarkTab />}
            {activeTab === "ebay" && <EbayTab />}
          </TabContainer>
        </div>
      </main>
    </>
  );
}
