import React, { useState, useEffect } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { auth, db } from "./firebase"; // Ensure correct Firebase imports
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export default function Complaint() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    upiId: "",
    complaint: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);

        // Fetch UPI ID from Firestore if available
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setFormData((prev) => ({ ...prev, upiId: userDoc.data().upiId || "" }));
        }
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a complaint.");
      return;
    }

    const upiPattern = /^[\w.-]+@[\w.-]+$/;
    if (!upiPattern.test(formData.upiId)) {
      setError("Please enter a valid UPI ID (e.g., username@bankname)");
      return;
    }

    if (formData.complaint.length < 10) {
      setError("Complaint must be at least 10 characters long.");
      return;
    }

    try {
      await addDoc(collection(db, "complaints"), {
        senderEmail: user.email,
        recipientUpiId: formData.upiId,
        complaint: formData.complaint,
        timestamp: new Date(),
      });

      setError("");
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({ upiId: formData.upiId, complaint: "" });
      }, 3000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("An error occurred while submitting your complaint. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md mx-auto bg-gray-800 p-6 shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">UPI Complaint Form</h2>
          <p className="mt-2 text-gray-400">Report issues with UPI transactions</p>
        </div>

        {!user ? (
          <div className="bg-red-50 p-4 rounded-md flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-400" />
            <p className="text-red-700 text-sm">You must be logged in to submit a complaint.</p>
          </div>
        ) : submitted ? (
          <div className="bg-green-50 p-4 rounded-md mb-6 text-center">
            <p className="text-green-800 font-medium">Complaint submitted successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">
                UPI ID (Receiver)
              </label>
              <input
                type="text"
                id="upiId"
                placeholder="example@bankname"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                disabled={!user}
              />
            </div>

            <div>
              <label htmlFor="complaint" className="block text-sm font-medium text-gray-300">
                Complaint Details
              </label>
              <textarea
                id="complaint"
                rows={4}
                placeholder="Describe your issue in detail..."
                value={formData.complaint}
                onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                disabled={!user}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              disabled={!user}
            >
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
