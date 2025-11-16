import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import IssueCard from "./components/IssueCard";
import IssueModal from "./components/IssueModal";
import RatingModal from "./components/RatingModal";
import { dummyIssues } from "./data/dummyIssues";
import { MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function TrackIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const statusColors = {
    pending: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    inprogress: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    resolved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  };

  const statusIcons = { pending: Clock, inprogress: AlertTriangle, resolved: CheckCircle };

  useEffect(() => {
    setTimeout(() => setIssues(dummyIssues), 1000);
  }, []);

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submitRating = () => {
    if (!selectedIssue || rating === 0) return;
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === selectedIssue.id
          ? { ...issue, citizen_rating: rating, citizen_feedback: feedback }
          : issue
      )
    );
    setShowRatingModal(false);
    setRating(0);
    setFeedback("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              statusColors={statusColors}
              statusIcons={statusIcons}
              setSelectedIssue={setSelectedIssue}
              setShowRatingModal={setShowRatingModal}
            />
          ))}
        </div>
      </div>

      {selectedIssue && !showRatingModal && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} statusColors={statusColors} />}
      {showRatingModal && <RatingModal rating={rating} setRating={setRating} feedback={feedback} setFeedback={setFeedback} submitRating={submitRating} setShowRatingModal={setShowRatingModal} />}
    </div>
  );
}
