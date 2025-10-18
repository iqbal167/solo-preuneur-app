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
      <ScrollView contentContainerClassName="flex-1 p-4 py-8" keyboardDismissMode="interactive">
        <View className="mx-auto w-full max-w-sm gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Text className="text-sm text-muted-foreground">Name</Text>
                <Text className="text-base font-medium">{user.name}</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted-foreground">Email</Text>
                <Text className="text-base font-medium">{user.email}</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted-foreground">Status</Text>
                <Text className="text-base font-medium">
                  {user.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm text-muted-foreground">Member Since</Text>
                <Text className="text-base font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </Text>
              </View>
            </CardContent>
          </Card>

          <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isLoggingOut} className="w-full">
                <Text>{isLoggingOut ? 'Logging out...' : 'Logout'}</Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <DialogDescription>Are you sure you want to logout?</DialogDescription>
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
      </ScrollView>
    </>
  );
}
