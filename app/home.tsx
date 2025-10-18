import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authStorage } from '@/lib/storage/auth';
import { router, Stack } from 'expo-router';
import { User } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const token = await authStorage.getAccessToken();
      if (!token) {
        router.replace('/');
        return;
      }
    } catch (error) {
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }

  function navigateToProfile() {
    router.push('/profile');
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Home' }} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => (
            <Pressable
              onPress={navigateToProfile}
              className="mr-4 rounded-full border border-primary/20 bg-primary/10 p-2">
              <User size={24} color="#3b82f6" />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerClassName="flex-1 p-4 py-8" keyboardDismissMode="interactive">
        <View className="flex-1 items-center justify-center gap-6">
          <Text className="text-center text-3xl font-bold">Welcome to Solo Preneur App</Text>

          <Text className="max-w-sm text-center text-lg text-muted-foreground">
            Your journey as a solo entrepreneur starts here
          </Text>

          <View className="w-full max-w-sm gap-4">
            <Button onPress={navigateToProfile} className="w-full">
              <Text>View Profile</Text>
            </Button>

            <Button variant="outline" onPress={() => {}} className="w-full">
              <Text>Get Started</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
