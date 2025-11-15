import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
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
      setOldPassword("");
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
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        toast.error("Failed to delete account. Please contact support.");
        return;
      }

      toast.success("Account deleted successfully");
      await signOut();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-foreground">Settings</h1>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-foreground mt-1">{user?.email}</p>
            </div>
            <Button onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Times</CardTitle>
            <CardDescription>Set when you'd like to receive daily reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="morning-enabled">Morning Check-in</Label>
                  <p className="text-sm text-muted-foreground">Daily morning reminder</p>
                </div>
                <Switch
                  id="morning-enabled"
                  checked={morningEnabled}
                  onCheckedChange={setMorningEnabled}
                />
              </div>
              {morningEnabled && (
                <Input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="ml-0"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="afternoon-enabled">Afternoon Feelings Check</Label>
                  <p className="text-sm text-muted-foreground">Mid-day check-in</p>
                </div>
                <Switch
                  id="afternoon-enabled"
                  checked={afternoonEnabled}
                  onCheckedChange={setAfternoonEnabled}
                />
              </div>
              {afternoonEnabled && (
                <Input
                  type="time"
                  value={afternoonTime}
                  onChange={(e) => setAfternoonTime(e.target.value)}
                  className="ml-0"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="evening-enabled">Evening Reflection</Label>
                  <p className="text-sm text-muted-foreground">End of day reflection</p>
                </div>
                <Switch
                  id="evening-enabled"
                  checked={eveningEnabled}
                  onCheckedChange={setEveningEnabled}
                />
              </div>
              {eveningEnabled && (
                <Input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="ml-0"
                />
              )}
            </div>

            <Button onClick={handleSaveNotificationTimes} disabled={savingTimes} className="w-full">
              {savingTimes ? "Saving..." : "Save Notification Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={signOut} className="w-full">
              Log Out
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
              className="w-full"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
