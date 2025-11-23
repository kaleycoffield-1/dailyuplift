import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Notification times
  const [morningTime, setMorningTime] = useState("08:00");
  const [afternoonTime, setAfternoonTime] = useState("14:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [afternoonEnabled, setAfternoonEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [savingTimes, setSavingTimes] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotificationTimes();
    }
  }, [user]);

  const fetchNotificationTimes = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("users")
      .select("notification_morning_time, notification_feelings_time, notification_evening_time, notification_morning_enabled, notification_feelings_enabled, notification_evening_enabled")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching notification times:", error);
      return;
    }

    if (data) {
      if (data.notification_morning_time) setMorningTime(data.notification_morning_time);
      if (data.notification_feelings_time) setAfternoonTime(data.notification_feelings_time);
      if (data.notification_evening_time) setEveningTime(data.notification_evening_time);
      setMorningEnabled(data.notification_morning_enabled ?? true);
      setAfternoonEnabled(data.notification_feelings_enabled ?? true);
      setEveningEnabled(data.notification_evening_enabled ?? true);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationTimes = async () => {
    if (!user) return;
    
    const timeSchema = z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)");
    
    try {
      timeSchema.parse(morningTime);
      timeSchema.parse(afternoonTime);
      timeSchema.parse(eveningTime);
    } catch (validationError) {
      toast.error("Invalid time format. Please use HH:MM format (e.g., 08:00)");
      return;
    }
    
    setSavingTimes(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          notification_morning_time: morningTime,
          notification_feelings_time: afternoonTime,
          notification_evening_time: eveningTime,
          notification_morning_enabled: morningEnabled,
          notification_feelings_enabled: afternoonEnabled,
          notification_evening_enabled: eveningEnabled
        })
        .eq("id", user.id);

      if (error) {
        toast.error("Failed to save notification times");
        return;
      }

      toast.success("Notification times updated");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSavingTimes(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-user');

      if (error) {
        console.error('Delete account error:', error);
        toast.error("Failed to delete account. Please contact support.");
        return;
      }

      toast.success("Account deleted successfully");
      await signOut();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-brown-900 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-brown-900">Settings</h1>

        {/* Account Information */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-brown-900 mb-2">Account Information</h2>
          <p className="text-sm text-brown-700 mb-4">Your account details</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-900 mb-1">Email</label>
              <p className="text-brown-900">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2 bg-primary text-brown-900 font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-brown-900 mb-2">Notification Times</h2>
          <p className="text-sm text-brown-700 mb-4">Set when you'd like to receive daily reminders</p>
          
          <div className="space-y-6">
            {/* Morning */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-brown-900">Morning Check-in</label>
                  <p className="text-sm text-brown-700">Daily morning reminder</p>
                </div>
                <button
                  onClick={() => setMorningEnabled(!morningEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    morningEnabled ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    morningEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {morningEnabled && (
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>

            {/* Afternoon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-brown-900">Afternoon Feelings Check</label>
                  <p className="text-sm text-brown-700">Mid-day check-in</p>
                </div>
                <button
                  onClick={() => setAfternoonEnabled(!afternoonEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    afternoonEnabled ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    afternoonEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {afternoonEnabled && (
                <input
                  type="time"
                  value={afternoonTime}
                  onChange={(e) => setAfternoonTime(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>

            {/* Evening */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-brown-900">Evening Reflection</label>
                  <p className="text-sm text-brown-700">End of day reflection</p>
                </div>
                <button
                  onClick={() => setEveningEnabled(!eveningEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    eveningEnabled ? "bg-primary" : "bg-border"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    eveningEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {eveningEnabled && (
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>

            <button
              onClick={handleSaveNotificationTimes}
              disabled={savingTimes}
              className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingTimes ? "Saving..." : "Save Notification Settings"}
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-brown-900 mb-4">Account Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={signOut}
              className="w-full px-6 py-3 bg-background border border-border text-brown-900 font-semibold rounded-full hover:bg-surface transition-all"
            >
              Log Out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-brown-900 mb-2">Change Password</h2>
            <p className="text-sm text-brown-700 mb-4">Enter your new password below</p>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-900 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brown-900 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-brown-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-background border border-border text-brown-900 font-semibold rounded-full hover:bg-surface transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-brown-900 font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-brown-900 mb-2">Are you absolutely sure?</h2>
            <p className="text-sm text-brown-700 mb-6">
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-background border border-border text-brown-900 font-semibold rounded-full hover:bg-surface transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
