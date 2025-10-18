import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { authApi } from '@/lib/api/auth';
import { authService } from '@/lib/services/auth';
import { authStorage } from '@/lib/storage/auth';
import { User } from '@/lib/types/auth';
import { router, Stack } from 'expo-router';
import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  React.useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const accessToken = await authStorage.getAccessToken();

      if (!accessToken) {
        router.replace('/');
        return;
      }

      const userData = await authApi.getUserProfile(accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      await authStorage.clearTokens();
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      // If API fails, still proceed with local logout
    }

    router.replace('/');
    setIsLoggingOut(false);
    setShowLogoutDialog(false);
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Profile' }} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView contentContainerClassName="p-4 py-8 pb-12" keyboardDismissMode="interactive">
        <View className="mx-auto w-full max-w-sm gap-6">
          {/* Avatar and Name Section */}
          <View className="items-center gap-4">
            <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10">
              <UserIcon size={48} color="#3b82f6" />
            </View>
            <View className="items-center gap-1">
              <Text className="text-2xl font-bold">{user.name}</Text>
              <Text className="text-sm text-muted-foreground">{user.email}</Text>
            </View>
          </View>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center gap-2">
                <UserIcon size={20} color="#6b7280" />
                <Text>Profile Information</Text>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Mail size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Email</Text>
                  <Text className="text-base font-medium">{user.email}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Shield size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Status</Text>
                  <View className="flex-row items-center gap-2">
                    <View
                      className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <Text className="text-base font-medium">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Calendar size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Member Since</Text>
                  <Text className="text-base font-medium">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Actions */}
          <View className="gap-3">
            <Button variant="outline" className="w-full">
              <Text>Edit Profile</Text>
            </Button>

            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isLoggingOut} className="w-full">
                  <Text>{isLoggingOut ? 'Logging out...' : 'Logout'}</Text>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout? You'll need to sign in again to access your
                    account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onPress={() => setShowLogoutDialog(false)}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button variant="destructive" onPress={handleLogout} disabled={isLoggingOut}>
                    <Text>{isLoggingOut ? 'Logging out...' : 'Logout'}</Text>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
